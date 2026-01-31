import React from "react";
import { Headphones, Shield, Truck } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Free Shipping",
    description: "On orders over $50",
    icon: Truck,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    id: 2,
    title: "Secure Payment",
    description: "100% secure transactions",
    icon: Shield,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Always here to help",
    icon: Headphones,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ id, title, description, icon: Icon, bg, color }) => (
            <div key={id} className="flex items-center space-x-4">
              <div
                className={`h-12 w-12 ${bg} rounded-full flex items-center justify-center`}
              >
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
