import React from "react";
import AIEvaluator from "./AIEvaluator";
import ThemeToggle from "./ThemeToggle";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <main>
        <AIEvaluator />
      </main>
    </div>
  );
};

export default Dashboard;
