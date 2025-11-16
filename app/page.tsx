// import CurrentlyBuilding from "@/components/CurrentlyBuilding";
// import GalleryCard from "@/components/GalleryCard";
// import GithubCard from "@/components/GithubCard";
// import LocationCard from "@/components/LocationCard";
// import ProfileCard from "@/components/ProfileCard";
// import ProjectCard from "@/components/ProjectCard";
// import SocialLinks from "@/components/SocialLinks";
// import SongCard from "@/components/SongCard";
// import TechStackCard from "@/components/TechStackCard";

// export default function Home() {
//   return (
//     <div className="h-screen w-screen p-4 flex items-center justify-center">
//       {/* Grid layout that changes based on screen size */}
//       <div className="w-full h-full lg:w-[95%] md:h-auto md:max-w-7xl md:aspect-[16/9]">
//         <div className="grid gap-4 h-full w-full
//           grid-rows-9
//           sm:grid-cols-9 sm:grid-rows-14
//           md:grid-cols-12 md:grid-rows-9">

//           {/* Currently building section */}
//           <div className=" bg-red-500
//             row-span-1
//             sm:col-start-7 sm:col-end-10 sm:row-start-1 sm:row-end-2
//             md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-2">
//             <CurrentlyBuilding />
//           </div>

//           {/* Profile section */}
//           <div className="rounded-xl row-span-2 bg-amber-100
//             sm:col-start-1 sm:col-end-7 sm:row-start-1 sm:row-end-5
//             md:col-start-4 md:col-end-9 md:row-start-1 md:row-end-5">
//             <ProfileCard />
//           </div>



//           {/* Socials section */}
//           <div className=" bg-cyan-400
//             row-span-1
//             sm:col-start-7 sm:col-end-10 sm:row-start-2 sm:row-end-4
//             md:col-start-9 md:col-end-11 md:row-start-2 md:row-end-5">
//             <SocialLinks />
//           </div>

//           {/* Tech stack section */}
//           <div className="bg-violet-700
//             row-span-1
//             sm:col-start-1 sm:col-end-5 sm:row-start-5 sm:row-end-11
//             md:col-start-1 md:col-end-4 md:row-start-1 md:row-end-7">
//             <TechStackCard />
//           </div>

//           {/* Location section */}
//           <div className=" bg-green-500
//             row-span-1
//             sm:col-start-5 sm:col-end-7 sm:row-start-5 sm:row-end-7
//             md:col-start-1 md:col-end-3 md:row-start-7 md:row-end-10">
//             <LocationCard />
//           </div>

//           {/* Gallery section */}
//           <div className="bg-yellow-200
//             row-span-1
//             sm:col-start-7 sm:col-end-10 sm:row-start-4 sm:row-end-7
//             md:col-start-11 md:col-end-13 md:row-start-2 md:row-end-5">
//             <GalleryCard/>
//           </div>

//           {/* Song section */}
//           <div className="row-span-1 bg-pink-500
//             sm:col-start-5 sm:col-end-10 sm:row-start-7 sm:row-end-8
//             md:col-start-4 md:col-end-7 md:row-start-5 md:row-end-7">
//             <SongCard />
//           </div>

//           {/* GitHub section */}
//           <div className=" bg-red-950
//             row-span-1
//             sm:col-start-5 sm:col-end-10 sm:row-start-8 sm:row-end-11
//             md:col-start-3 md:col-end-7 md:row-start-7 md:row-end-10">
//             <GithubCard />
//           </div>

//           {/* Projects section */}
//           <div className="bg-white/20 sm:bg-white/20 md:bg-[#252525] rounded-xl
//             row-span-1
//             sm:col-start-1 sm:col-end-10 sm:row-start-11 sm:row-end-15
//             md:col-start-7 md:col-end-13 md:row-start-5 md:row-end-10">
//             <ProjectCard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }























"use client"
import CurrentlyBuilding from "@/components/CurrentlyBuilding";
import GalleryCard from "@/components/GalleryCard";
import GithubCard from "@/components/GithubCard";
import LocationCard from "@/components/LocationCard";
import ProfileCard from "@/components/ProfileCard";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks from "@/components/SocialLinks";
import SongCard from "@/components/SongCard";
import TechStackCard from "@/components/TechStackCard";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/store/modalStore";

export default function Home() {
  const { isModalOpen, selectedMedia, setModalState } = useModalStore();

  return (
    <div className="h-screen w-screen p-4 flex items-center justify-center">
      {/* Grid layout that changes based on screen size */}
      <div className="w-full h-full sm:aspect-[9/16] sm:h-auto sm:my-auto lg:my-0 lg:w-[95%] md:h-auto md:max-w-7xl md:aspect-[16/9]">

        {/* Large screens (md and above) */}
        <div className="hidden md:grid grid-cols-12 grid-rows-9 gap-4 h-full w-full">
          {/* Tech stack section */}
          <div className="col-start-1 col-end-4 row-start-1 row-end-7 rounded-xl">
            <TechStackCard />
          </div>

          {/* Location section */}
          <div className="col-start-1 col-end-3 row-start-7 row-end-10 rounded-xl">
            <LocationCard />
          </div>

          {/* Profile section */}
          <div className="col-start-4 col-end-9 row-start-1 row-end-5 rounded-xl">
            <ProfileCard />
          </div>

          {/* Currently building section */}
          <div className="col-start-9 col-end-13 row-start-1 row-end-2 rounded-xl">
            <CurrentlyBuilding />
          </div>

          {/* Socials section */}
          <div className="col-start-9 col-end-11 row-start-2 row-end-5 rounded-xl">
            <SocialLinks />
          </div>

          {/* Song section */}
          <div className="col-start-4 col-end-7 row-start-5 row-end-7 rounded-xl">
            <SongCard />
          </div>

          {/* GitHub section */}
          <div className="col-start-3 col-end-7 row-start-7 row-end-10 rounded-xl">
            <GithubCard />
          </div>

          {/* Projects section */}
          <div className="col-start-7 col-end-13 row-start-5 row-end-10 rounded-xl">
            <ProjectCard />
          </div>

          {/* Gallery section */}
          <div className="col-start-11 col-end-13 row-start-2 row-end-5 rounded-xl">
            <GalleryCard />
          </div>
        </div>

        {/* Medium screens (sm but not md) */}
        <div className="hidden sm:grid overflow-scroll md:hidden grid-cols-9 grid-rows-16 gap-4 h-full w-full">
          {/* Profile section */}
          <div className="overflow-auto col-start-1 col-end-7 row-start-1 row-end-5 rounded-xl">
            <ProfileCard />
          </div>

          {/* Currently building section */}
          <div className="overflow-auto col-start-7 col-end-10 row-start-1 row-end-2 rounded-xl">
            <CurrentlyBuilding />
          </div>

          {/* Socials section */}
          <div className="overflow-auto col-start-7 col-end-10 row-start-2 row-end-4 rounded-xl">
            <SocialLinks />
          </div>

          {/* Tech stack section */}
          <div className="overflow-auto col-start-1 col-end-5 row-start-5 row-end-12 rounded-xl">
            <TechStackCard />
          </div>

          {/* Location section */}
          <div className="overflow-auto col-start-5 col-end-7 row-start-5 row-end-7 rounded-xl">
            <LocationCard />
          </div>

          {/* Gallery section */}
          <div className="overflow-auto col-start-7 col-end-10 row-start-4 row-end-7 rounded-xl">
            <GalleryCard />
          </div>

          {/* Song section */}
          <div className="overflow-auto hide-scrollbar col-start-5 col-end-10 row-start-7 row-end-9 rounded-xl">
            <SongCard />
          </div>

          {/* GitHub section */}
          <div className="overflow-auto col-start-5 col-end-10 row-start-9 row-end-12 rounded-xl">
            <GithubCard />
          </div>

          {/* Projects section */}
          <div className="overflow-auto col-start-1 col-end-10 row-start-12 row-end-17 rounded-xl">
            <ProjectCard />
          </div>
        </div>

        {/* Small screens (below sm) */}
        <div className="grid sm:hidden gap-4 w-full h-full">
          {/* Currently building section */}
          <div className="h-16 w-full rounded-xl">
            <CurrentlyBuilding />
          </div>

          {/* Profile section */}
          <div className="h-72 rounded-xl">
            <ProfileCard />
          </div>

          {/* Socials section */}
          <div className="h-full rounded-xl">
            <SocialLinks />
          </div>

          {/* Tech stack section */}
          <div className="h-96 rounded-xl">
            <TechStackCard />
          </div>

          {/* GitHub section */}
          <div className="h-[16rem] rounded-xl">
            <GithubCard />
          </div>

          {/* Location section */}
          <div className="w-full h-auto aspect-square">
            <LocationCard />
          </div>
          <div className="w-full h-auto aspect-square">
            <GalleryCard />
          </div>

          <div className="w-full h-full max-h-[9.3rem]">
            <SongCard />
          </div>

          {/* Projects section */}
          <div className="h-full rounded-xl pb-4">
            <ProjectCard />
          </div>
        </div>
      </div>

      {/* Render Modal at the top level */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalState(false, null)}
        media={selectedMedia}
      />
    </div>
  );
}