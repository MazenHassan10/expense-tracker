import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
function App() {
  const [totalSpent, setTotalSpent] = useState(0);
  const fetchTotalSpent = async () => {
    try {
      const result = await axios.get(
        "http://localhost:5173/api/expenses/total-spent"
      );
      setTotalSpent(result.data.totalSpent);
    } catch (err) {
      console.error((err as Error).message);
    }
  };
  useEffect(() => {
    fetchTotalSpent();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The Total Amount You Have Spent</CardDescription>
        </CardHeader>
        <CardFooter>
          <p>{totalSpent}</p>
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
