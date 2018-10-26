// Mixins
import Colorable from '../../mixins/colorable';
import DatePickerTable from './mixins/date-picker-table';
import Themeable from '../../mixins/themeable';
// Utils
import { pad, createNativeLocaleFormatter } from './util';
/* @vue/component */
export default {
    name: 'v-date-picker-month-table',
    mixins: [
        Colorable,
        DatePickerTable,
        Themeable
    ],
    computed: {
        formatter() {
            return this.format || createNativeLocaleFormatter(this.locale, { month: 'short', timeZone: 'UTC' }, { start: 5, length: 2 });
        }
    },
    methods: {
        calculateTableDate(delta) {
            return `${parseInt(this.tableDate, 10) + Math.sign(delta || 1)}`;
        },
        genTBody() {
            const children = [];
            const cols = Array(3).fill(null);
            const rows = 12 / cols.length;
            for (let row = 0; row < rows; row++) {
                const tds = cols.map((_, col) => {
                    const month = row * cols.length + col;
                    return this.$createElement('td', {
                        key: month
                    }, [
                        this.genButton(`${this.displayedYear}-${pad(month + 1)}`, false)
                    ]);
                });
                children.push(this.$createElement('tr', {
                    key: row
                }, tds));
            }
            return this.$createElement('tbody', children);
        }
    },
    render() {
        return this.genTable('v-date-picker-table v-date-picker-table--month', [
            this.genTBody()
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJNb250aFRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkRhdGVQaWNrZXIvVkRhdGVQaWNrZXJNb250aFRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLGVBQWUsTUFBTSw0QkFBNEIsQ0FBQTtBQUN4RCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUV6RCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSwyQkFBMkI7SUFFakMsTUFBTSxFQUFFO1FBQ04sU0FBUztRQUNULGVBQWU7UUFDZixTQUFTO0tBQ1Y7SUFFRCxRQUFRLEVBQUU7UUFDUixTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLDJCQUEyQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDOUgsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1Asa0JBQWtCLENBQUUsS0FBSztZQUN2QixPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUNsRSxDQUFDO1FBQ0QsUUFBUTtZQUNOLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtZQUNuQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1lBRTdCLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7b0JBQzlCLE1BQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQTtvQkFDckMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRTt3QkFDL0IsR0FBRyxFQUFFLEtBQUs7cUJBQ1gsRUFBRTt3QkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO3FCQUNqRSxDQUFDLENBQUE7Z0JBQ0osQ0FBQyxDQUFDLENBQUE7Z0JBRUYsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRTtvQkFDdEMsR0FBRyxFQUFFLEdBQUc7aUJBQ1QsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ1Q7WUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQy9DLENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZ0RBQWdELEVBQUU7WUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRTtTQUNoQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IERhdGVQaWNrZXJUYWJsZSBmcm9tICcuL21peGlucy9kYXRlLXBpY2tlci10YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbHNcbmltcG9ydCB7IHBhZCwgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyIH0gZnJvbSAnLi91dGlsJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAndi1kYXRlLXBpY2tlci1tb250aC10YWJsZScsXG5cbiAgbWl4aW5zOiBbXG4gICAgQ29sb3JhYmxlLFxuICAgIERhdGVQaWNrZXJUYWJsZSxcbiAgICBUaGVtZWFibGVcbiAgXSxcblxuICBjb21wdXRlZDoge1xuICAgIGZvcm1hdHRlciAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXQgfHwgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMubG9jYWxlLCB7IG1vbnRoOiAnc2hvcnQnLCB0aW1lWm9uZTogJ1VUQycgfSwgeyBzdGFydDogNSwgbGVuZ3RoOiAyIH0pXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjYWxjdWxhdGVUYWJsZURhdGUgKGRlbHRhKSB7XG4gICAgICByZXR1cm4gYCR7cGFyc2VJbnQodGhpcy50YWJsZURhdGUsIDEwKSArIE1hdGguc2lnbihkZWx0YSB8fCAxKX1gXG4gICAgfSxcbiAgICBnZW5UQm9keSAoKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG4gICAgICBjb25zdCBjb2xzID0gQXJyYXkoMykuZmlsbChudWxsKVxuICAgICAgY29uc3Qgcm93cyA9IDEyIC8gY29scy5sZW5ndGhcblxuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICAgICAgY29uc3QgdGRzID0gY29scy5tYXAoKF8sIGNvbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1vbnRoID0gcm93ICogY29scy5sZW5ndGggKyBjb2xcbiAgICAgICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGQnLCB7XG4gICAgICAgICAgICBrZXk6IG1vbnRoXG4gICAgICAgICAgfSwgW1xuICAgICAgICAgICAgdGhpcy5nZW5CdXR0b24oYCR7dGhpcy5kaXNwbGF5ZWRZZWFyfS0ke3BhZChtb250aCArIDEpfWAsIGZhbHNlKVxuICAgICAgICAgIF0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0cicsIHtcbiAgICAgICAgICBrZXk6IHJvd1xuICAgICAgICB9LCB0ZHMpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGJvZHknLCBjaGlsZHJlbilcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZW5UYWJsZSgndi1kYXRlLXBpY2tlci10YWJsZSB2LWRhdGUtcGlja2VyLXRhYmxlLS1tb250aCcsIFtcbiAgICAgIHRoaXMuZ2VuVEJvZHkoKVxuICAgIF0pXG4gIH1cbn1cbiJdfQ==