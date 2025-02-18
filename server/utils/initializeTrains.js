import Train from "../models/trains.js";

const initialTrains = [
  {
    trainId: "RAJ001",
    name: "Rajdhani Express",
    totalSeats: 100,
    bookedSeats: [],
    route: "Delhi to Mumbai",
    departureTime: "16:00",
    arrivalTime: "08:00",
  },
  {
    trainId: "SHT002",
    name: "Shatabdi Express",
    totalSeats: 100,
    bookedSeats: [],
    route: "Delhi to Chandigarh",
    departureTime: "07:00",
    arrivalTime: "11:30",
  },
  {
    trainId: "DUR003",
    name: "Duronto Express",
    totalSeats: 100,
    bookedSeats: [],
    route: "Mumbai to Bangalore",
    departureTime: "23:00",
    arrivalTime: "15:00",
  },
  {
    trainId: "TEJ004",
    name: "Tejas Express",
    totalSeats: 100,
    bookedSeats: [],
    route: "Bangalore to Chennai",
    departureTime: "06:00",
    arrivalTime: "12:30",
  },
];

const initializeTrains = async () => {
  try {
    const existingTrains = await Train.countDocuments();

    if (existingTrains === 0) {
      console.log("Starting train initialization...");

      const result = await Train.insertMany(initialTrains);

      console.log("✓ Trains initialized successfully");
      console.log(`✓ ${result.length} trains added to the database`);

      result.forEach((train) => {
        console.log(`  - Added ${train.name} (${train.trainId})`);
      });
    } else {
      console.log("Trains already initialized in database");
      console.log(`Found ${existingTrains} existing trains`);
    }
  } catch (error) {
    console.error("Error during train initialization:");
    console.error(error);

    if (error.code === 11000) {
      console.error(
        "Duplicate train IDs found. Please check the initial train data."
      );
    }

    throw new Error("Failed to initialize trains");
  }
};

const resetTrains = async () => {
  try {
    console.log("Resetting all trains...");

    await Train.deleteMany({});

    await initializeTrains();

    console.log("✓ Trains reset successfully");
  } catch (error) {
    console.error("Error during train reset:");
    console.error(error);
    throw new Error("Failed to reset trains");
  }
};

const getTrainDetails = async (trainId) => {
  try {
    const train = await Train.findOne({ trainId });
    if (!train) {
      throw new Error("Train not found");
    }
    return train;
  } catch (error) {
    console.error(`Error fetching train details for ${trainId}:`, error);
    throw error;
  }
};

const updateTrainSchedule = async (trainId, newSchedule) => {
  try {
    const train = await Train.findOneAndUpdate(
      { trainId },
      {
        $set: {
          departureTime: newSchedule.departureTime,
          arrivalTime: newSchedule.arrivalTime,
        },
      },
      { new: true }
    );

    if (!train) {
      throw new Error("Train not found");
    }

    return train;
  } catch (error) {
    console.error(`Error updating schedule for train ${trainId}:`, error);
    throw error;
  }
};

export {
  initializeTrains,
  resetTrains,
  getTrainDetails,
  updateTrainSchedule,
  initialTrains,
};
