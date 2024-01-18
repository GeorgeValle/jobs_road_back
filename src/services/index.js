import {
    CandidateDAO,
    EducationDAO,
    ExperienceDAO,
    UserDAO,
  } from "../daos/Factory.js";
  
 
  import UserRepository from "./UserRepository.js";
  import SessionRepository from "./SessionRepository.js";
 
  
  
  export const userRepository = new UserRepository(
    new UserDAO(),
  );
  export const sessionRepository = new SessionRepository(new UserDAO());
 