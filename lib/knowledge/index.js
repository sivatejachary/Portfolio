import { profileKnowledge } from "./profile";
import { experienceKnowledge } from "./experience";
import { projectsKnowledge } from "./projects";
import { skillsKnowledge } from "./skills";
import { educationKnowledge } from "./education";
import { achievementsKnowledge } from "./achievements";
import { contactKnowledge } from "./contact";
import { careerGoalsKnowledge } from "./careerGoals";

export const ALL_KNOWLEDGE_CHUNKS = [
  ...profileKnowledge,
  ...experienceKnowledge,
  ...projectsKnowledge,
  ...skillsKnowledge,
  ...educationKnowledge,
  ...achievementsKnowledge,
  ...contactKnowledge,
  ...careerGoalsKnowledge
];
