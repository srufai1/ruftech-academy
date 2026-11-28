import type { Metadata } from "next";

export const metadata: Metadata = { title: "Course glossary" };

const terms = [
  ["path", "Path", "Directions to a file or folder.", "A sequence of directory names leading to a filesystem entry."],
  ["absolute-path", "Absolute path", "Directions that start at the top.", "A Linux path beginning with /, resolved from the filesystem root."],
  ["relative-path", "Relative path", "Directions from where you are.", "A path resolved against the working directory."],
  ["permission", "Permission", "A rule about who may open or change something.", "A read, write or execute access bit for the owner, group or others."],
  ["symbolic-link", "Symbolic link", "A sign pointing to another name.", "A filesystem entry containing a target path, which can exist even when the target is missing."],
];

export default function GlossaryPage() {
  return (
    <article>
      <h1>Course glossary</h1>
      <h2>Unit 1.1 · The terminal and the filesystem</h2>
      <dl>
        {terms.map(([id, term, simple, technical]) => (
          <div key={id} id={id}>
            <dt><strong>{term}</strong></dt>
            <dd>{simple} {technical}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
