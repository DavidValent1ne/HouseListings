import { getCrew } from "@/app/page";
async function fetchSpaceXCrew() {
    const url = `https://api.spacexdata.com/v4/crew`;
  
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

type ModelProps = {
    params: {id: any}
  };

  
async function fetchLaunches() {
    const url = `https://api.spacexdata.com/v4/launches`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Request failed with status:", response.status);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
const tempInfo = getCrew()
export default async function Model({params }: ModelProps) {
    const crewInfo = await fetchSpaceXCrew()
    const rawLaunchData = await fetchLaunches();
    let filteredLaunchData: any[] = []
    let filteredCrewData = null;
    let indeces: number[] = []


    for (const member of crewInfo) {
        if (member.id === params.id) {
            filteredCrewData = member;
            break;
            
        }
    }
    for (const launch of rawLaunchData) {
        if (launch.id === filteredCrewData.launches[0]) {
            filteredLaunchData.push(launch)
            break;
        }
    }

    return (
    
        <div className="model_return">
            <img className="crew_image"src={filteredCrewData.image} height="250" width="250" alt="image" />
            <p>{filteredCrewData.name}</p>
            <br />
            <p> 
                Number of launches: {filteredCrewData.launches.length} 
            </p><br />

            {filteredLaunchData.map((launch: any) => (
            <div key={launch.id}>

                {launch.success ? (
                <p>Launch: {launch.name} was a success!</p>
                ) : (
                <p>Launch: {launch.name} was not a success!</p>
                )}
                <br />
                <p>Details: {JSON.stringify(launch.details)}</p>
                <br />
            </div>
            ))}
            <a className="link-style" href={`../`}>
                <p>Back to Table</p>
            </a>
        </div>
    )
}