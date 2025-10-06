import React, { useState } from 'react';
import { Dumbbell, TrendingUp, Target, ChevronRight, Zap } from 'lucide-react';

const FLOOR_EQUIPMENT = {
  1: ["treadmill", "elliptical", "stair_climber", "rowing_machine", "stationary_bike"],
  2: ["bench_press", "incline_bench", "decline_bench", "chest_fly_machine", "cable_crossover", "dip_station"],
  3: ["squat_rack", "leg_press", "leg_extension", "leg_curl", "calf_raise_machine", "hip_abductor"],
  4: ["lat_pulldown", "cable_row", "assisted_pullup", "t_bar_row", "back_extension"],
  5: ["shoulder_press_machine", "lateral_raise_machine", "cable_shoulder_raise", "shrugs_station", "pec_deck"],
  6: ["bicep_curl_machine", "preacher_curl_bench", "tricep_extension_machine", "tricep_dip_machine", "cable_station"],
  7: ["dumbbells", "kettlebells", "battle_ropes", "medicine_balls", "resistance_bands", "bench"]
};

const WORKOUT_TEMPLATES = {
  push: {
    name: "Push Day",
    description: "Chest, Shoulders, Triceps",
    icon: "💪",
    exercises: [
      "bench_press", "incline_bench", "chest_fly_machine", "cable_crossover",
      "shoulder_press_machine", "lateral_raise_machine", "cable_shoulder_raise",
      "tricep_extension_machine", "tricep_dip_machine", "cable_station"
    ]
  },
  pull: {
    name: "Pull Day",
    description: "Back, Biceps",
    icon: "🔙",
    exercises: [
      "lat_pulldown", "cable_row", "assisted_pullup", "t_bar_row", "back_extension",
      "bicep_curl_machine", "preacher_curl_bench", "cable_station", "dumbbells"
    ]
  },
  legs: {
    name: "Leg Day",
    description: "Quads, Hamstrings, Calves",
    icon: "🦵",
    exercises: [
      "squat_rack", "leg_press", "leg_extension", "leg_curl",
      "calf_raise_machine", "hip_abductor", "dumbbells"
    ]
  },
  upper: {
    name: "Upper Body",
    description: "Chest, Back, Shoulders, Arms",
    icon: "🏋️",
    exercises: [
      "bench_press", "incline_bench", "lat_pulldown", "cable_row",
      "shoulder_press_machine", "bicep_curl_machine", "tricep_extension_machine", "dumbbells"
    ]
  },
  cardio: {
    name: "Cardio Day",
    description: "Cardiovascular Training",
    icon: "❤️",
    exercises: [
      "treadmill", "elliptical", "stair_climber", "rowing_machine", "stationary_bike"
    ]
  },
  fullBody: {
    name: "Full Body",
    description: "Complete Workout",
    icon: "⚡",
    exercises: [
      "squat_rack", "bench_press", "lat_pulldown", "shoulder_press_machine",
      "leg_press", "cable_row", "dumbbells"
    ]
  }
};

const App = () => {
  const [step, setStep] = useState('select');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [customExercises, setCustomExercises] = useState([]);
  const [results, setResults] = useState(null);

  const getAllEquipment = () => {
    const all = new Set();
    Object.values(FLOOR_EQUIPMENT).forEach(eq => eq.forEach(e => all.add(e)));
    return Array.from(all).sort();
  };

  const calculateFloorScores = (exercises) => {
    const scores = {};
    
    Object.entries(FLOOR_EQUIPMENT).forEach(([floor, equipment]) => {
      const matches = exercises.filter(ex => equipment.includes(ex));
      if (matches.length > 0) {
        scores[floor] = {
          count: matches.length,
          percentage: (matches.length / exercises.length) * 100,
          equipment: matches
        };
      }
    });
    
    return scores;
  };

  const handleWorkoutSelect = (workoutKey) => {
    const workout = WORKOUT_TEMPLATES[workoutKey];
    setSelectedWorkout(workoutKey);
    const scores = calculateFloorScores(workout.exercises);
    setResults({
      exercises: workout.exercises,
      scores: scores,
      workoutName: workout.name
    });
    setStep('results');
  };

  const handleCustomExercise = (exercise) => {
    setCustomExercises(prev => 
      prev.includes(exercise) 
        ? prev.filter(e => e !== exercise)
        : [...prev, exercise]
    );
  };

  const analyzeCustomWorkout = () => {
    if (customExercises.length === 0) return;
    
    const scores = calculateFloorScores(customExercises);
    setResults({
      exercises: customExercises,
      scores: scores,
      workoutName: 'Custom Workout'
    });
    setStep('results');
  };

  const formatEquipmentName = (name) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const reset = () => {
    setStep('select');
    setSelectedWorkout(null);
    setCustomExercises([]);
    setResults(null);
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-white rounded-full mb-4">
              <Dumbbell className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">Gym Floor Optimizer</h1>
            <p className="text-xl text-indigo-100">Find the perfect floor for your workout</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries(WORKOUT_TEMPLATES).map(([key, workout]) => (
              <button
                key={key}
                onClick={() => handleWorkoutSelect(key)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-left"
              >
                <div className="text-4xl mb-3">{workout.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{workout.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{workout.description}</p>
                <div className="flex items-center text-indigo-600 font-semibold">
                  <span className="text-sm">Analyze</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('custom')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🎯 Create Custom Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'custom') {
    const allEquipment = getAllEquipment();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={reset}
            className="text-white mb-6 hover:underline"
          >
            ← Back to Workouts
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Your Equipment</h2>
            
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {allEquipment.map(equipment => (
                <label
                  key={equipment}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    customExercises.includes(equipment)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={customExercises.includes(equipment)}
                    onChange={() => handleCustomExercise(equipment)}
                    className="w-5 h-5 text-indigo-600 mr-3"
                  />
                  <span className="font-medium text-gray-800">
                    {formatEquipmentName(equipment)}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={analyzeCustomWorkout}
                disabled={customExercises.length === 0}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                  customExercises.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                Analyze ({customExercises.length} selected)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    const sortedFloors = Object.entries(results.scores)
      .sort((a, b) => b[1].count - a[1].count);
    
    const bestFloor = sortedFloors[0];
    const secondFloor = sortedFloors.length > 1 ? sortedFloors[1] : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={reset}
            className="text-white mb-6 hover:underline"
          >
            ← Back to Workouts
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">{results.workoutName}</h2>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Best Option</h3>
              </div>
              <p className="text-4xl font-bold mb-2">Floor {bestFloor[0]}</p>
              <p className="text-lg opacity-90">
                {bestFloor[1].count} out of {results.exercises.length} exercises ({bestFloor[1].percentage.toFixed(0)}%)
              </p>
            </div>

            {secondFloor && bestFloor[1].count < results.exercises.length && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-900">Pro Tip</h4>
                </div>
                <p className="text-blue-800">
                  Combine Floor {bestFloor[0]} and Floor {secondFloor[0]} for {Math.min(bestFloor[1].count + secondFloor[1].count, results.exercises.length)} out of {results.exercises.length} exercises
                </p>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-4">Floor Breakdown</h3>
            <div className="space-y-4">
              {sortedFloors.map(([floor, data]) => (
                <div key={floor} className="border-2 border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">Floor {floor}</h4>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {data.count}/{results.exercises.length} ({data.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.equipment.map(eq => (
                      <span
                        key={eq}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {formatEquipmentName(eq)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Plan Another Workout
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default App;