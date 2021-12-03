
export class User {
  name: string;
  email: string;
  photo_url: string;
  provider_id: string;

  constructor(name: string, email: string, photo_url: string, provider_id: string ) {
    this.name = name;
    this.email = email;
    this.photo_url = photo_url;
    this.provider_id = provider_id;
  }
}
