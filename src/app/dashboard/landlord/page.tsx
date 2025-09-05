"use client"
import ProtectedRouteWithRole from "@/components/ProtectedRouteWithRole";
import React from "react";
import GoogleAddressSearch from "@/components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react"; // Add this import or replace with your Loader component
const supabase = createClient();

const LandlordDashboard = () => {
  const [selectedAddress, setSelectedAddress] = React.useState<any>(null);
  const [coordinates, setCordinates] = React.useState({ lat: 0, lng: 0 });
  const [loader, setLoader] = React.useState(false);
  const router = useRouter();


  const nextHandler = async () => {
    setLoader(true);
    console.log(selectedAddress, coordinates);

    const { data: { user } = {} } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('listing')
      .insert([
        {
          address: selectedAddress,
          coordinates: coordinates,
          createdBy: user?.email
        },
      ])
      .select()
    if (data) {
      setLoader(false);
      console.log("Data inserted successfully", data);
      toast("Data inserted successfully")
      router.replace(('/dashboard/edit-listing/' + data[0].id));
    }
    else {
      setLoader(false);
      console.log("Error inserting data", error);
      toast("Error inserting data")
    }
  }
  return (
    <ProtectedRouteWithRole>
      <div className='mt-10 md:mx-56 lg:mx-80'>
        <div className="p-10 mt-20 flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl font-bold">Add New Listing</h2>
          <div className='p-10 rounded-lg border w-full shadow-md flex flex-col gap-5'>
            <h2 className='text-gray-500'>Enter Address which you want to list</h2>
            <GoogleAddressSearch
              selectedAddress={(value) => setSelectedAddress(value)}
              setCoordinates={(value) => setCordinates(value)}
            />
            <Button
              disabled={!selectedAddress || !coordinates.lat || !coordinates.lng || loader}
              onClick={nextHandler}
            > {loader ? <Loader className="animate-spin" /> : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRouteWithRole>
  );
};

export default LandlordDashboard;