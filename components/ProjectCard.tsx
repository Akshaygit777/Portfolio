"use client";
import React, { useRef } from 'react';
import ProjectGallery from './project/ProjectGallery';
import { Card } from './ui/card';
// import { FiArrowUpRight } from 'react-icons/fi';
import { projects } from "@/constants/contants"

const ProjectCard = () => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card className="h-full relative my-auto w-full max-h-[25rem] border-none outline overflow-y-hidden project-card-container p-0 m-0" >
      <div className='absolute h-10 w-full font-NHassDisplay inline-flex items-center justify-between px-6 z-30'>
        <div className='font-medium uppercase tracking-wider opacity-50'>
          Projects
        </div>
        {/* <div className="inline-flex items-center h-full cursor-pointer uppercase opacity-50 group">
          <span className="relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:left-0 group-hover:after:w-full">
            View All
          </span>
          <FiArrowUpRight className="w-6 h-6 ml-0.5 transition-transform duration-200 group-hover:rotate-45" />
        </div> */}
      </div>

      <div className="flex flex-col items-center space-y-6 opacity-0 demo-1__gallery p-6" ref={galleryRef}>
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-full max-w-[800px] demo-1__gallery__figure"
          >
            {project.media[0].type === 'video' ? (
              <video
                className="w-full h-auto object-cover demo-1__gallery__image"
                src={project.media[0].src}
                muted
                loop
                playsInline
              />
            ) : (
              <img
                className="w-full h-auto object-cover demo-1__gallery__image"
                src={project.media[0].src}
                alt={`Project ${project.title}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full h-full absolute z-30 mt-10" ref={containerRef}>
        <ProjectGallery projects={projects} galleryRef={galleryRef} containerRef={containerRef} />
        {/* <div className='h-5 w-full z-40 absolute bottom-10 bg-gradient-to-t from-background to-transparent' />
        <div className='h-5 w-full z-40 absolute top-0 bg-gradient-to-b from-background to-transparent' /> */}
      </div>
    </Card>
  );
};

export default ProjectCard;