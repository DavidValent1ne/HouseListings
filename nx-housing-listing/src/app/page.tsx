import Image from "next/image";

/*
https://github.com/r-spacex/SpaceX-API/blob/master/docs/crew/v4/all.md
*/
type Crew = {
  name: string;
  agency: string;
  image: string;
  wikipedia: string;
  launches: string[];
  status: string;
  id: string;
};

async function fetchSpaceXCrew() {
  const url = `https://api.spacexdata.com/v4/crew`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Process the fetched data here
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
      <section>
        {/* 
        SOME STUFF TO DO:
        1. Lets start by making this a table where we can see all of the crews information
        2. We should be able to sort by name, agency, status (https://tanstack.com/table/v8) WE use this in our company.
        3. We should be able to filter by agency
        4. When we click on the image, we should be able to see a modal with more information about the crew member specifically more information about the launches they have been on.
        5. We should be able to search by name
        6. when we click on wiki we should open a new tab with the wikipedia page
        7. We should be able to see the number of launches they have been on
        */}
        {crewInfo?.map((crew) => (
          <div key={crew.id} className="w-auto h-auto">
            <Image src={crew.image} alt={crew.name} width={50} height={50} />
          </div>
        ))}
      </section>
    </main>
  );
}
