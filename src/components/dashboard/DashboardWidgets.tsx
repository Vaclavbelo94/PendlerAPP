import React from "react";
import EducationWidget from "./EducationWidget";

const DashboardWidgets = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EducationWidget />
    </div>
  );
};

export default DashboardWidgets;
