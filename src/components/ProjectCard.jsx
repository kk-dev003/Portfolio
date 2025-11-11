// src/components/ProjectCard.jsx

export default function ProjectCard({ image, title, category }) {
  return (
    <div className="rounded-xl overflow-hidden card hover:shadow-lg transition">
      <img src={image} className="w-full h-52 object-cover" />
      <div className="p-4">
        <div className="text-white font-semibold text-lg">{title}</div>
        <div className="text-white/60 text-sm">{category}</div>
      </div>
    </div>
  );
}
