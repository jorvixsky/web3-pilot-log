import Header from "@/components/common/header";
import NewFlight from "@/components/common/new-flight";

export default function NewFlightPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 justify-center items-center m-4">
        <h1 className="text-2xl font-bold">New Flight</h1>
        <NewFlight />
      </div>
    </>
  );
}
