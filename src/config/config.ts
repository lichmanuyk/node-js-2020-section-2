import dotenv from 'dotenv';

export class Config {
  public ACCESS_TOKEN_SECRET: string;
  public REFRESH_TOKEN_SECRET: string;
  public ACCESS_TOKEN_LIFE: number;
  public REFRESH_TOKEN_LIFE: number;

  public DB_NAME: string;
  public DB_USER_NAME: string;
  public DB_USER_PASSWORD: string;
  public HOST: string;
  public PORT: string;

  constructor() {
    dotenv.config();
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    this.ACCESS_TOKEN_LIFE = Number(process.env.ACCESS_TOKEN_LIFE);
    this.REFRESH_TOKEN_LIFE = Number(process.env.REFRESH_TOKEN_LIFE);

    this.DB_NAME = 'postgres';
    this.DB_USER_NAME = 'postgres';
    this.DB_USER_PASSWORD = '12345';
    this.HOST = 'localhost';
    this.PORT = '5432';
  }
}
