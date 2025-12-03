"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Car } from "./api";

interface CompareContextType {
    selectedCars: Car[];
    addCarToCompare: (car: Car) => void;
    removeCarFromCompare: (carId: string) => void;
    clearCompare: () => void;
    setCars: (cars: Car[]) => void;
    isInCompare: (carId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [selectedCars, setSelectedCars] = useState<Car[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("compare_cars");
        if (saved) {
            try {
                setSelectedCars(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse compare cars", e);
            }
        }
    }, []);

    // Save to localStorage whenever selectedCars changes
    useEffect(() => {
        localStorage.setItem("compare_cars", JSON.stringify(selectedCars));
    }, [selectedCars]);

    const addCarToCompare = (car: Car) => {
        if (selectedCars.length >= 3) {
            alert("Bạn chỉ có thể so sánh tối đa 3 xe cùng lúc.");
            return;
        }
        if (!isInCompare(car.id)) {
            setSelectedCars([...selectedCars, car]);
        }
    };

    const removeCarFromCompare = (carId: string) => {
        setSelectedCars(selectedCars.filter(c => c.id !== carId));
    };

    const clearCompare = () => {
        setSelectedCars([]);
    };

    const setCars = (cars: Car[]) => {
        setSelectedCars(cars);
    };

    const isInCompare = (carId: string) => {
        return selectedCars.some(c => c.id === carId);
    };

    return (
        <CompareContext.Provider value={{ selectedCars, addCarToCompare, removeCarFromCompare, clearCompare, setCars, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
