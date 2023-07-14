import { CrewTable } from "@/components/CrewTable"
export type Crew = {
  name: string;
  agency: string;
  image: string;
  wikipedia: string;
  launches: string[];
  status: string;
  id: string;
};

let crewCachedData: any = null; //this acts as a cache to reduce the number of api calls from the dynamic page
export async function fetchSpaceXCrew() {
  if (crewCachedData){
      return crewCachedData
  }
  const url = `https://api.spacexdata.com/v4/crew`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      crewCachedData = data;
      return data;
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
let launchCachedData: any = null
export async function fetchLaunches() {
  if (launchCachedData){
    return launchCachedData
}
  const url = `https://api.spacexdata.com/v4/launches`;

  try {
      const response = await fetch(url);
      if (response.ok) {
          const data = await response.json();
          launchCachedData = data
          return data;
      } else {
          console.error("Request failed with status:", response.status);
      }
  } catch (error) {
      console.error("An error occurred:", error);
  }
}

export default async function Home() {
  const crewInfo: Crew[] = await fetchSpaceXCrew();


  return (
    <main className="">
      <h1 className="text-4xl font-bold text-center py-4">
        SpaceX Crew Members
      </h1>
      <section style={{ margin: '0 auto' }}>
        {/* 
        SOME STUFF TO DO:
        1. Lets start by making this a table where we can see all of the crews information  **DONE**
        2. We should be able to sort by name, agency, status (https://tanstack.com/table/v8) WE use this in our company. **DONE**
        3. We should be able to filter by agency **DONE**
        4. When we click on the image, we should be able to see a modal with more information about the crew member specifically more information about the launches they have been on. **DONE**
        5. We should be able to search by name **DONE**
        6. when we click on wiki we should open a new tab with the wikipedia page **DONE**
        7. We should be able to see the number of launches they have been on **DONE
        */}
        <CrewTable crewInfo={crewInfo}/>
      </section>
    </main>
  );
}
