import { registerPageContent } from '../constants/register-content'

export function RegisterVisualPanel() {
  return (
    <div className="relative hidden overflow-hidden md:flex md:w-5/12">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10" />
      <img
        src={registerPageContent.image.src}
        alt={registerPageContent.image.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex h-full flex-col justify-end p-12">
        <span className="mb-2 text-xs uppercase tracking-[0.2em] text-white/70">
          {registerPageContent.eyebrow}
        </span>
        <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white">
          {registerPageContent.title}
        </h1>
        <p className="mt-4 max-w-xs leading-relaxed text-white/80">
          {registerPageContent.description}
        </p>
      </div>
    </div>
  )
}
