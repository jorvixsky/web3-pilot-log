interface FlightPopupProps {
    data: any,
    onClosePopup: ()=>void;
}

export default function FlightPopup({data, onClosePopup} : FlightPopupProps) {
    const header2Classname= "text-2xl font-extrabold dark:text-white";
    const header3Classname= "text-1l font-bold dark:text-white";
    const blockSeparationClass = "my-4";

    function getTime(hour: number, min: number) : string {
        var res = "";
        if(hour < 10) res += "0";
        res += hour;
        res += ":";
        if(min < 10) res += "0" ;
        res += min;
        return res;
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    return (
        <div className={"fixed overflow-auto h-full w-full absolute t-0 l-0 size-max z-50 inset-0 " + ((data==undefined)?"hidden":"")} onClick={onClosePopup}> 
            <div className="h-full w-full bg-gray-500 t-0 l-0 opacity-80 blur "/>

            <div className={"absolute w-[42rem]  h-fit bg-white m-auto left-0 right-0 top-0 bottom-0 p-12 \
                            border rounded-xl"}>
                <h1 className="text-4xl font-extrabold dark:text-white text-center mb-24">Flight details</h1>
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
            </div>
        </div>
    );
  }
  