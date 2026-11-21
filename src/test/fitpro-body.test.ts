import { describe, expect, it } from "vitest";
import { weightStatus, idealRange, waistStatus } from "@/fitpro/body";
import { applyCoach } from "@/fitpro/coach";

describe("peso ideal y colores", () => {
  it("175 cm y 70 kg está en peso ideal (verde)", () => {
    const s = weightStatus(70, 175);
    expect(s.id).toBe("ideal");
    expect(s.color).toBe("green");
  });
  it("175 cm y 78 kg tiene sobrepeso y le sobran 1.7 kg", () => {
    const s = weightStatus(78, 175);
    expect(s.id).toBe("sobrepeso");
    expect(s.kg).toBe(1.7);
  });
  it("172 cm y 84 kg tiene sobrepeso (amarillo) y le sobran 10.3 kg", () => {
    const s = weightStatus(84, 172);
    expect(s.id).toBe("sobrepeso");
    expect(s.color).toBe("yellow");
    expect(s.kg).toBe(10.3);
  });
  it("obesidad se marca en rojo", () => {
    expect(weightStatus(100, 165).color).toBe("red");
  });
  it("rango de peso ideal para 175 cm es 56.7–76.3 kg", () => {
    expect(idealRange(175)).toEqual({ min: 56.7, max: 76.3 });
  });
});

describe("cintura", () => {
  it("hombre con 97 cm está en alerta y debe bajar 4 cm para estar bajo 94", () => {
    const w = waistStatus(97, "hombre");
    expect(w?.color).toBe("yellow");
    expect(w?.cm).toBe(4);
  });
  it("mujer con 90 cm está en rojo (88 cm o más)", () => {
    expect(waistStatus(90, "mujer")?.color).toBe("red");
  });
  it("mujer con 78 cm está en verde", () => {
    expect(waistStatus(78, "mujer")?.color).toBe("green");
  });
});

describe("coach duro", () => {
  it("el coach duro quita 30% del descanso", () => {
    const r = applyCoach({ exercises: [{ name: "x", time: 50, rest: 20 }] }, { coach: "duro" });
    expect(r.exercises[0].rest).toBe(14);
  });
  it("el coach monarca deja la mitad del descanso", () => {
    const r = applyCoach({ exercises: [{ name: "x", time: 50, rest: 20 }] }, { coach: "monarca" });
    expect(r.exercises[0].rest).toBe(10);
  });
});
