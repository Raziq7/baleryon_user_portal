import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { User, MapPin, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  number: string;
  id:string;
};

interface AddressFormProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
}


// List of Indian states
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function AddressForm({ address, setAddress }: AddressFormProps) {
  // const [address, setAddress] = useState<Address>({
  //   name: "",
  //   street: "",
  //   city: "",
  //   state: "",
  //   zip: "",
  //   number: "",
  // });
  const [submitted] = useState(false);
  const [stateSearch, setStateSearch] = useState(""); // For client-side filtering

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleStateSelect = (value: string) => {
    setAddress({ ...address, state: value });
  };

  const filteredStates = indianStates.filter(
    (st) => st.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted(true);
  //   if (
  //     address.name &&
  //     address.street &&
  //     address.city &&
  //     address.state &&
  //     address.zip &&
  //     address.number
  //   ) {
  //     // onSave?.(address);
  //   }
  // };

  return (
    <Card className="border-none shadow-none p-0">
      <CardContent className="p-0">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4" />Full Name</Label>
            <Input
              id="name"
              name="name"
              value={address.name}
              onChange={handleChange}
              className="mt-1"
              placeholder="Full Name"
              required
            />
            {submitted && !address.name && <span className="text-red-600 text-xs">Name is required</span>}
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="street" className="flex items-center gap-2"><MapPin className="w-4 h-4" />Street</Label>
            <Input
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="mt-1"
              placeholder="Street Address"
              required
            />
            {submitted && !address.street && <span className="text-red-600 text-xs">Street is required</span>}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="mt-1"
              placeholder="City"
              required
            />
            {submitted && !address.city && <span className="text-red-600 text-xs">City is required</span>}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={address.state}
              onValueChange={handleStateSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {/* Filter input for autocomplete */}
                <div className="px-2 py-1 w-full">
                  <Input
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Type to search..."
                    className="mb-2 w-full"
                  />
                </div>
                {filteredStates.length > 0 ? (
                  filteredStates.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground px-3 py-2">
                    No state found
                  </div>
                )}
              </SelectContent>
            </Select>
            {submitted && !address.state && <span className="text-red-600 text-xs">State is required</span>}
          </div>
          <div>
            <Label htmlFor="zip">Pin</Label>
            <Input
              id="zip"
              name="zip"
              value={address.zip}
              onChange={handleChange}
              className="mt-1"
              placeholder="Postal / Pin Code"
              required
              pattern="[0-9]{4,}"
            />
            {submitted && !address.zip && <span className="text-red-600 text-xs">Pin is required</span>}
          </div>
          <div>
            <Label htmlFor="number" className="flex items-center gap-2"><Phone className="w-4 h-4" />Mobile</Label>
            <Input
              id="number"
              name="number"
              value={address.number}
              onChange={handleChange}
              className="mt-1"
              placeholder="Mobile Number"
              required
              pattern="[0-9]{8,}"
            />
            {submitted && !address.number && <span className="text-red-600 text-xs">Mobile number is required</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}