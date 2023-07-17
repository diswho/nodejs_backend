import { Request, Response } from "express";
export interface InfoRequest extends Request {
  token: string; // or any other type
}
export interface InfoResponse extends Response {
  token: string; // or any other type
}
