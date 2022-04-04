import msToMinutesAndSeconds from "../util/time";

describe("time util suite", () => {
  test("Sending in zero should return 0:00", () => {
    const durationMs = 0;
    const time = msToMinutesAndSeconds(durationMs);
    expect(time).toBe("0:00");
  });

  test("Sending in less than zero should return 0:00", () => {
    const durationMs = -100;

    const time = msToMinutesAndSeconds(durationMs);
    expect(time).toBe("0:00");
  });

  test("Expect duration of song money - lime cordiale, 3m:58s ", () => {
    const durationMs = 238180;
    const time = msToMinutesAndSeconds(238180);
    expect(time).toBe("3:58");
  });

  test("Expect duration of I kissed a girl - Katy Perry, 3m:00s", () => {
    const durationMs = 179640;
    const time = msToMinutesAndSeconds(durationMs);
    expect(time).toBe("3:00");
  });
});
