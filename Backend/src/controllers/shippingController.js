import fetch from "node-fetch";
import Shipment from "../models/Shipment.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getCoords = async (input) => {
  const key = process.env.LOCATIONIQ_KEY;
  if (!input) return null;

  const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  if (coordRegex.test(input)) {
    const [lat, lon] = input.split(",").map((value) => parseFloat(value.trim()));
    return { lat, lon };
  }

  const url = `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(
    input
  )}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("Alamat tidak ditemukan:", input);
      return { lat: -6.974097, lon: 107.597262 };
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Gagal mengambil koordinat:", error);
    return { lat: -6.974097, lon: 107.597262 };
  }
};

const calcDistance = (a, b) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const calculateShipping = async (req, res) => {
  try {
    const { orderId, customerAddress, weight, type, hasService } = req.body;

    const weightNumber = Number(weight);
    if (Number.isNaN(weightNumber) || weightNumber <= 0) {
      return res.status(400).json({ message: "Berat paket tidak valid" });
    }

    const serviceType = type || "regular";
    const hasServiceFlag =
      typeof hasService === "string"
        ? hasService.toLowerCase() === "true"
        : Boolean(hasService);

    let resolvedAddress =
      typeof customerAddress === "string" ? customerAddress.trim() : "";
    let addressSource = "payload";

    if (!resolvedAddress && req.user?.id) {
      const profile = await User.findById(req.user.id)
        .select("address")
        .lean();
      if (profile?.address) {
        resolvedAddress = profile.address;
        addressSource = "profile";
      }
    }

    if (!resolvedAddress) {
      return res.status(400).json({ message: "Alamat pembeli wajib diisi" });
    }

    const roastery = { lat: -6.974097, lon: 107.597262 };
    const roasteryAddress =
      "Jl. Nata Endah No.11B, Margahayu Tengah, Kabupaten Bandung, Jawa Barat 40228";

    const coordCustomer = await getCoords(resolvedAddress);

    if (!coordCustomer) {
      return res
        .status(404)
        .json({ message: "Koordinat pembeli tidak ditemukan" });
    }

    const perKm = serviceType === "cargo" ? 2500 : 4000;
    let totalDistance = 0;
    let cost = 0;
    const shipments = [];

    if (hasServiceFlag) {
      const distanceIn = calcDistance(coordCustomer, roastery);
      const distanceOut = calcDistance(roastery, coordCustomer);
      totalDistance = distanceIn + distanceOut;
      cost = Math.round(perKm * totalDistance * (weightNumber / 10));

      const inbound = new Shipment({
        orderId,
        type: "customer_to_roastery",
        originAddress: resolvedAddress,
        destinationAddress: roasteryAddress,
        weight: weightNumber,
        service: serviceType,
        status: "pickup_scheduled",
      });

      const outbound = new Shipment({
        orderId,
        type: "roastery_to_customer",
        originAddress: roasteryAddress,
        destinationAddress: resolvedAddress,
        weight: weightNumber,
        service: serviceType,
        status: "pending",
      });

      await inbound.save();
      await outbound.save();
      shipments.push(inbound, outbound);
    } else {
      const distance = calcDistance(roastery, coordCustomer);
      totalDistance = distance;
      cost = Math.round(perKm * totalDistance * (weightNumber / 10));

      const outbound = new Shipment({
        orderId,
        type: "roastery_to_customer",
        originAddress: roasteryAddress,
        destinationAddress: resolvedAddress,
        weight: weightNumber,
        service: serviceType,
        status: "pending",
      });

      await outbound.save();
      shipments.push(outbound);
    }

    res.json({
      message: "Penghitungan ongkir berhasil",
      summary: {
        totalDistance: `${totalDistance.toFixed(2)} km`,
        totalCost: cost,
        service: serviceType,
        weight: weightNumber,
        mode: hasServiceFlag ? "two_way" : "one_way",
      },
      address: {
        value: resolvedAddress,
        source: addressSource,
      },
      shipments,
    });
  } catch (error) {
    console.error("Error menghitung ongkir:", error);
    res.status(500).json({
      message: "Error menghitung ongkir",
      error: error.message,
    });
  }
};

export const trackShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shipments = await Shipment.find({ orderId });

    if (!shipments.length) {
      return res
        .status(404)
        .json({ message: "Data pengiriman tidak ditemukan" });
    }

    res.json({ orderId, shipments });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({
      message: "Gagal mengambil data pengiriman",
      error: error.message,
    });
  }
};

