import { test } from "@/test"
import { parseDate } from "@/components/VCalendar/util/timestamp"
import VCalendar from "@/components/VCalendar/VCalendar"

test("VCalendar", ({ mount }) => {
  it("should render day view", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        type: "day",
        start: "2018-01-29",
        end: "2018-02-04",
        now: "2019-02-17"
      },
      methods: {
        getNow: () => parseDate(new Date("2019-02-17"))
      }
    });

    expect(wrapper.hasClass("v-calendar-daily")).toBe(true)
    expect(wrapper.html()).toMatchSnapshot();
  })

  it("should render week view", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        type: "week",
        start: "2018-01-29",
        end: "2018-02-04",
        now: "2019-02-17"
      },
      methods: {
        getNow: () => parseDate(new Date("2019-02-17"))
      }
    });

    expect(wrapper.hasClass("v-calendar-daily")).toBe(true)
    expect(wrapper.html()).toMatchSnapshot();
  })

  it("should render month view", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        type: "month",
        start: "2018-01-29",
        end: "2018-02-04",
        now: "2019-02-17"
      },
      methods: {
        getNow: () => parseDate(new Date("2019-02-17"))
      }
    });

    expect(wrapper.hasClass("v-calendar-monthly")).toBe(true)
    expect(wrapper.html()).toMatchSnapshot();
  })

  it("should parse value", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        value: "2019-02-02",
        start: "2019-01-29",
        end: "2019-02-04"
      }
    });

    expect(wrapper.vm.parsedValue.date).toBe("2019-02-02")
  })

  it("should parse start", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        start: "2019-01-29",
        end: "2019-02-04"
      }
    });

    expect(wrapper.vm.parsedValue.date).toBe("2019-01-29")
  })

  // TODO Create a test that doesn"t fail when
  // the day changes or ignore the code it
  // covers
  it.skip("should calculate end", async () => {
    const wrapper = mount(VCalendar, {
      propsData: {
        end: "2018-12-04"
      }
    });

    expect(wrapper.vm.parsedValue.date).toEqual(new Date().toISOString().split("T")[0])
  })
});
