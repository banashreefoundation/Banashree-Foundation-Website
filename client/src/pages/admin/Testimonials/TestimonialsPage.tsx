import { DataTableTestimonials } from "./data-table-testimonials";
import columnsTestimonial from "./columns";

const TestimonialsPage = () => {
  return (
    <div className="w-full">
      <DataTableTestimonials columns={columnsTestimonial} />
    </div>
  );
};

export default TestimonialsPage;
