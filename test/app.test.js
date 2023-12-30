import app from '../backend/index.js';
import supertest from 'supertest'; 

describe("GET routes returning 200", () => {
    it("should return 200", async () => {
        const response = await supertest(app).get("/blog");
        expect(response.status).toBe(200);
    });

    it("should return 200", async () => {
        const response = await supertest(app).get("/");
        expect(response.status).toBe(200);
    });
});