export default class ProfileDTO {
    constructor(user) {
        this.email = user.email;
        this.name = user.name;
        this.surname = user.surname;
        this.role = user.role; 
    }
  }