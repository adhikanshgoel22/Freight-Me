import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Query = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*");

      if (error) {
        console.error("Error fetching queries:", error.message);
      } else {
        setQueries(data);
      }

      setLoading(false);
    };

    fetchQueries();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Submitted Queries</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {queries.map((query) => (
            <div
              key={query.id}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-blue-600 mb-2">{query.name}</h2>
              <p className="text-sm text-gray-500 mb-1"><span className="font-medium">Email:</span> {query.email}</p>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{query.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Query;