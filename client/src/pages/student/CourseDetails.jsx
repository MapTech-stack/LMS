import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);

  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateAverageRating,
    calculateChapterTime,
    calculateNoOfLectures,
    calculateCourseDuration,
    currency,
  } = useAppContext();

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-10 pt-8 text-left ">
        {/* Left side */}
        <div className="max-w-xl z-10 text-primary">
          <h1 className=" md:text-course-details-heading-large text-course-details-heading-small font-semibold text-heading ">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}></p>

          {/* course Rating */}
          <div className="flex items-center gap-2 mt-1 pt-3 pb-1 text-sm">
            {/* average rating */}
            <p>{calculateAverageRating(courseData)}</p>
            {/* Star Rating */}
            <div className="flex ">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateAverageRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="Star rating"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            {/* Total Nummber of rating */}
            <p className="text-accent">
              ({courseData.courseRatings.length}
              {courseData.courseRatings.length > 1 ? "Ratings" : "Rating"})
            </p>
            <p>
              {courseData.enrolledStudents.length}
              {courseData.enrolledStudents.length > 1
                ? " Students"
                : " Student"}{" "}
            </p>
          </div>

          <p className="text-sm">
            Course by
            <span className="text-accent underline">Mustapha abiodun</span>{" "}
          </p>

          <div className=" pt-6 text-heading">
            <h2 className="text-xl font-semibold">Course Struture</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 p-1 rounded mb-2 ">
                  <div
                    onClick={() => toggleSection(index)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                      />
                      <p className="text-sm md:text-base font-medium">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection[index] ? "max-h-96" : "max-h-0"
                    }`}>
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-accent">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start py-1 gap-2 ">
                          <img
                            src={assets.play_icon}
                            alt=" Play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className=" flex items-center justify-between w-full text-heading text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className=" text-accent cursor-pointer ">
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}{" "}
                                mins
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-heading">
              Course Description{" "}
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}></p>
          </div>
        </div>

        {/* Right side */}
        <div className=" max-w-course-card z-10 custom-shadow rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] ">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                  
                },
              }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}

          <div className="p-5  ">
            <div className="flex gap-2 items-center">
              <img
                src={assets.time_left_clock_icon}
                alt="time_left_clock_icon"
                className="w-3.5"
              />

              <p className="text-red-500">
                <span className=" font-medium">5 days</span> left at this price!
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <p className="text-heading text-2xl md:text-4xl font-semibold">
                {currency}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="text-gray-primary line-through md:text-lg">
                {currency} {courseData.coursePrice.toFixed(2)}
              </p>
              <p className="text-lg text-gray-primary">
                {courseData.discount}% off{" "}
              </p>
            </div>

            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4  text-primary">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="Star icon" />
                <p>{calculateAverageRating(courseData)}</p>
              </div>

              <div className="h-4 w-px  bg-primary/40 "></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px  bg-primary/40 "></div>

              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button className=" w-full brg-accent text-white font-semibold py-3 px-4 rounded-md mt-6 bg-accent hover:bg-accent-hover transition-colors duration-300 cursor-pointer">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <p className="text-heading text-lg md:text-xl font-medium">
                What’s in the course?
              </p>
              <ul className="list-disc pl-5 pt-2 text-sm md:text-default text-primary ml-4">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
                <li>Access to a community of learners.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
