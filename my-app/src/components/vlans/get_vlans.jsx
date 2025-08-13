import React, { useState } from "react";
import api from "../../api";

const GetVlans = () => {
  const [vlans, setVlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const getVlan = async () => {
    if (!showTable) {
      setLoading(true);
      try {
        const response = await api.get("/vlans/");
        const vlanList =
          response.data["sonic-vlan:sonic-vlan"]?.VLAN?.VLAN_LIST || [];
        setVlans(vlanList);
      } catch (error) {
        if (error.response) {
          alert("Failed to fetch vlan data: " + error.response.data.detail);
        } else {
          console.error("Unknown error:", error);
        }
      }
      setLoading(false);
    }

    setShowTable(!showTable);
  };

  return (
    <div className="w-full text-gray-800">
      <button
        onClick={getVlan}
        className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded shadow mb-4"
      >
        {loading
          ? "Loading..."
          : showTable
            ? "Collapse VLAN Data"
            : "Get VLAN Data"}
      </button>

      {showTable &&
        (vlans.length > 0 ? (
          <>
            <div className="overflow-y-auto max-h-[320px] border border-gray-200 rounded shadow ">
              <table className="w-full text-sm">
                <thead className="bg-orange-200 text-orange-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-center">VLAN ID</th>
                    <th className="px-4 py-2 text-center">Name</th>
                    <th className="px-4 py-2 text-center">Description</th>
                    <th className="px-4 py-2 text-center">MAC Learning</th>
                  </tr>
                </thead>
                <tbody>
                  {vlans.map((vlan, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 ">
                      <td className="px-4 py-2 semibold text-sm">
                        {vlan.vlanid}
                      </td>
                      <td className="px-4 py-2 semibold text-sm">
                        {vlan.name}
                      </td>
                      <td className="px-4 py-2 semibold text-sm">
                        {vlan.description || (
                          <span className="text-gray-400 ">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 capitalize semibold text-sm">
                        {vlan.mac_learning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          !loading && <p className="text-gray-500  text-sm">No VLANs found.</p>
        ))}
    </div>
  );
};

export default GetVlans;
