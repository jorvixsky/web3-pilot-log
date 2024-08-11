import { ValidationResponse } from "@/lib/structs";
import { formatDate } from "@/utils";
import { Button } from "../ui/button";

interface FlightPopupProps {
    contractData: ValidationResponse|undefined,
    data: any,
    onClosePopup: ()=>void,
    onValidateEntry: ()=>void,
    isLoading: boolean,
    showValidateButton: boolean
}

export default function ValidateEntryPopup({isLoading, contractData, data,onValidateEntry, onClosePopup, showValidateButton} : FlightPopupProps) {
    const header2Classname= "text-2xl font-extrabold dark:text-white";
    const header3Classname= "text-1l font-bold dark:text-white";
    const blockSeparationClass = "my-4";

    console.log("entry popup data", data)
    function getTime(hour: number, min: number) : string {
        var res = "";
        if(hour < 10) res += "0";
        res += hour;
        res += ":";
        if(min < 10) res += "0" ;
        res += min;
        return res;
    }

    function validateEntry(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        e.stopPropagation();
        onValidateEntry();

    }

    function closePopup(){
        if(isLoading)
            return;
        console.log("close popup from close popup")
        onClosePopup();
    }

    return (
        <div className={"fixed overflow-auto h-full w-full absolute t-0 l-0 size-max z-50 inset-0 " + ((data==undefined)?"hidden":"")} onClick={closePopup}> 
            <div className="h-full w-full bg-gray-500 t-0 l-0 opacity-80 blur "/>

            <div className={"absolute w-[42rem] max-h-full over h-fit bg-white m-auto left-0 right-0 top-0 bottom-0 p-12 \
                            border rounded-xl"}>
                <h1 className="text-4xl font-extrabold dark:text-white text-center mb-24">Signing flight details</h1>
                <div id="date" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Date</h2>
                    <p>{formatDate(data?.date)}</p>
                </div>
                <div id="departure" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Departure</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Place</h3>
                            <p>{data?.departure?.place}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Time</h3>
                            <p>{data?.departure?.time}</p>
                        </div>
                    </div>
                </div>
                <div id="arrival" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Arrival</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Place</h3>
                            <p>{data?.arrival?.place}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Time</h3>
                            <p>{data?.arrival?.time}</p>
                        </div>
                    </div>
                </div>
                <div id="aircraft" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Aircraft</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Model</h3>
                            <p>{data?.aircraft?.model}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Registration</h3>
                            <p>{data?.aircraft?.registration}</p>
                        </div>
                    </div>
                </div>
                <div id="PICs" className={blockSeparationClass}>
                    <h2 className={header2Classname}>PICs</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Names</h3>
                            <p>{data?.pics}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Self signed</h3>
                            <p>{"" + data?.selfSigned}</p>
                        </div>
                    </div>
                    <div className="flex-1 size-full">
                        <h3 className={header3Classname}>Signed by</h3>
                        <p>{"" + data?.signedBy}</p>
                    </div>
                </div>
                <div id="singlePilotTime" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Single pilot time</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Single Engine</h3>
                            <p>{"" + data?.singlePilotTime.singleEngine}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Multi Engine</h3>
                            <p>{"" + data?.singlePilotTime.multiEngine}</p>
                        </div>
                    </div>
                </div>
                <div id="tof" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Time of flight</h2>
                    <p>{getTime(data?.totalTimeOfFlight?.hours, data?.totalTimeOfFlight.minutes) }</p>
                </div>
                <div id="landings" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Landings</h2>
                    <div className="flex">
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Day</h3>
                            <p>{"" + data?.numberOfLandings.day}</p>
                        </div>
                        <div className="flex-1 size-full">
                            <h3 className={header3Classname}>Night</h3>
                            <p>{"" + data?.numberOfLandings.night}</p>
                        </div>
                    </div>
                </div>
                <div id="remarks" className={blockSeparationClass}>
                    <h2 className={header2Classname}>Remarks</h2>
                    <p>{data?.remarks}</p>
                </div>
                { showValidateButton &&
                <div id="validate" className="size-full flex items-center flex-row place-content-center">
                    <Button className="items-center" onClick={(e)=>validateEntry(e)}>{
                    isLoading?
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    :
                    <>Validate</>
                        }</Button>
                </div>}
            </div>
        </div>
    );
  }
  