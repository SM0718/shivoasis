import type { FC } from "react";
import type { WorkProject } from "../data/projects";

interface WorkItemProps {
  project: WorkProject;
}

const WorkItem: FC<WorkItemProps> = ({ project }) => (
  <div className="work_item" data-work="item">
    <div className="work_image-wrapper">
      <img
        src={project.image.src}
        loading="lazy"
        sizes="100vw"
        alt={project.image.alt}
        className="work_image"
        data-work="image"
      />
    </div>

    <div className="work_item-wrapper">
      <div className="work_video-wrapper">
        {project.videos.map((video, i) => (
          <div className="work_video-container" data-work="video" key={i}>
            <div className="work_video">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={video.poster}
                style={{ backgroundImage: `url("${video.poster}")` }}
                data-object-fit="cover"
              >
                <source src={video.mp4} type="video/mp4" />
                {video.webm && <source src={video.webm} type="video/webm" />}
              </video>
            </div>
          </div>
        ))}
      </div>

      <div className="work_text">
        <div className="work_text-title">
          {project.title.map((line, i) => (
            <div className="line-wrapper" key={i}>
              <div className="line" data-line>
                {line.accent && (
                  <span className={line.accentClass}>{line.accent}</span>
                )}
                {line.text}
              </div>
            </div>
          ))}
        </div>

        <div className="work-text-subtitle">
          {project.subtitle.map((text, i) => (
            <div className="line-wrapper" key={i}>
              <div className="line" data-line>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="work_item-overlay" data-work="item-overlay" />
  </div>
);

export default WorkItem;
