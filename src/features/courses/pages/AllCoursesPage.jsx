import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Home } from "lucide-react";
import { COURSE_GROUPS } from "../../learn/shared/allCourses";

export default function AllCoursesPage() {
  const [searchParams] = useSearchParams();
  const focusStack = searchParams.get("stack");

  useEffect(() => {
    if (!focusStack) return;
    const section = document.getElementById(`course-stack-${focusStack}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusStack]);

  return (
    <main className="all-courses-page">
      <div className="all-courses-page-inner">
        <nav className="all-courses-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">
            <Home size={15} aria-hidden />
            Home
          </Link>
          <span aria-hidden>/</span>
          <span>All courses</span>
        </nav>

        <header className="all-courses-hero">
          <span className="all-courses-kicker">Course catalog</span>
          <h1>All courses</h1>
          <p>
            Browse every interactive course on PolyCode, grouped by language
            stack. Pick a track and start learning.
          </p>
          <Link className="all-courses-hero-link" to="/select-language">
            <BookOpen size={16} aria-hidden />
            Pick a language stack
          </Link>
        </header>

        <div className="all-courses-stacks">
          {COURSE_GROUPS.map((group) => (
            <section
              key={group.id}
              id={`course-stack-${group.id}`}
              className={`all-courses-stack${
                focusStack === group.id ? " all-courses-stack--focus" : ""
              }`}
              style={{ "--stack-accent": group.accent }}
            >
              <div className="all-courses-stack-head">
                <div>
                  <span className="all-courses-stack-label">{group.label}</span>
                  <h2>{group.label} courses</h2>
                  <p>{group.courses.length} interactive courses</p>
                </div>
                <Link
                  className="all-courses-stack-hub"
                  to={group.languagePath}
                >
                  {group.label} hub
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>

              <div className="all-courses-grid">
                {group.courses.map((course) => {
                  const Icon = course.icon;
                  return (
                    <Link
                      key={course.href}
                      to={course.href}
                      className="all-courses-card"
                      style={{ "--course-accent": course.accent || group.accent }}
                    >
                      <div className="all-courses-card-icon">
                        <Icon size={22} aria-hidden />
                      </div>
                      <span className="all-courses-card-tag">{course.tag}</span>
                      <h3>{course.title}</h3>
                      {course.description ? (
                        <p>{course.description}</p>
                      ) : null}
                      <strong>
                        Start course
                        <ArrowRight size={15} aria-hidden />
                      </strong>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
