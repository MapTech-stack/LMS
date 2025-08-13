import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialSection = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      <h1 className="text-2xl font-medium text-heading">Testimonials</h1>
      <p className="text-base text-primary mt-3 max-w-2xl mx-auto text-balance">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform has made a difference in their lives.
      </p>

      {/* Testimonials can be added here as a list or grid */}
      <div className="grid grid-cols-auto gap-8 mt-14" >
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className=" text-small text-left border border-primary/30 rounded-lg pb-6 bg-white my-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4 bg-primary/10">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="rounded-full w-12 h-12"
              />
              <div>
                <h1 className="text-lg text-heading/80">{testimonial.name}</h1>
                <p className="text-heading/80">{testimonial.role}</p>
              </div>

            </div>
            
              <div className="p-5 pb-7">
                <div className="flex items-center gap-2 ">
                  {[...Array(5)].map((_, i) => (
                    <img
                      src={
                        i < Math.floor(testimonial.rating)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt="Star rating"
                      className="h-5"
                    />
                  ))}
                </div>

                {/* review */}
                <p className="text-primary mt-5">{testimonial.feedback}</p>
              </div>
              <a href='#' className="text-accent px-5">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
