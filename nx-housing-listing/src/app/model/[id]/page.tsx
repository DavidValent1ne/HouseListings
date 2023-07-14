import { fetchSpaceXCrew, fetchLaunches } from "@/app/page";

type ModelProps = {
    params: {id: any}
  };

function nameById(crewInfo: any, id: any){
    for (const member of crewInfo) {
        if (member.id === id) {
            return (member.name)
            
        }
    }
    return('Cannot find member')
}
  
export default async function Model({params }: ModelProps) {
    const crewInfo = await fetchSpaceXCrew() //pulls from saved data rather than calling the api again
    const rawLaunchData = await fetchLaunches();
    let filteredLaunchData: any[] = []
    let filteredCrewData = null;


    for (const member of crewInfo) { // finds the crew member associated with the id in the url
        if (member.id === params.id) {
            filteredCrewData = member;
            break;
            
        }
    }
    for (const launch of rawLaunchData) { //allows for mulitple launches to be viewed though currently all members have only been on one launch
        if (launch.id === filteredCrewData.launches[0]) {
            filteredLaunchData.push(launch)
            break;
        }
    }

    return (
    
        <div className="model_return">
            <h1 className="text-4xl font-bold text-center py-4">
                {filteredCrewData.name}
            </h1>
            <img className="crew_image"src={filteredCrewData.image} height="250" width="250" alt="image" /* This is the same image the table uses but a little larger *//> 
            <p> 
                Number of launches: {filteredCrewData.launches.length} 
            </p><br />

            {filteredLaunchData.map((launch: any) => (
            <div key={launch.id}>

                {launch.success ? ( //i beleive all launches in the dataset are succesful but incase one isnt it will show on the model
                <p>Launch: {launch.name} was a success!</p>
                ) : (
                <p>Launch: {launch.name} was not a success!</p>
                )}
                <br />
                <p>Crew Size {launch.crew.length}</p>
                
                {launch.crew.map((member: any) => ( //adds a list of the members aboard the launch and links to their own page
                <div key={member}>
                    <a className="link-style" href={`/model/${member}`}>
                        <p>{nameById(crewInfo, member)}</p>
                    </a>
                </div>
                ))}
                <br />
                <p>Details: {launch.details}</p> {/* this provides a paragraph style of information straight from the spaceX api  */}
                <br />
            </div>
            ))}
            <a className="link-style" href={`../`}> {/*links back to the main page*/}
                <p>Back to Table</p>
            </a>
        </div>
    )
}