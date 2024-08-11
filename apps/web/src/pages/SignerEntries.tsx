import useSelectContract from "@/hooks/useSelectContract";
import { useAccount, useReadContract } from "wagmi";
import pilotLog from "../../contracts.json";
import { useEffect } from "react";
import Header from "@/components/common/header";
import EntriesToValidate from "@/components/common/entriesToValidate";
import {ValidationResponse} from "@/lib/structs";

export default function SignerEntries() {
    const contract = useSelectContract();
    const { isConnected, address } = useAccount();

    const result = useReadContract({
        address: contract,
        abi: pilotLog[0].abi,
        functionName: "getEntriesToValidate",
        args: [],
        account: address,
    }).data as ValidationResponse[];

    
    useEffect(() => {
        console.log("result", result);
    }, [result]);

    useEffect(() => {
        if (!isConnected) {
            window.location.href = "/";
        }
    }, [isConnected]);
      
    return ( 
    <div>
        <Header />
        <div className="flex flex-col gap-4 mx-auto justify-center items-center mt-8 mb-8">
            <h1 className="text-4xl font-bold">Signer entries</h1>
            <div className="flex gap-4 justify-center items-center ">
                <EntriesToValidate data={result}/>
            </div>
        </div>
    </div>);
}