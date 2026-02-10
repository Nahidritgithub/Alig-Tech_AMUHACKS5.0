def readiness(s):
    return round(
        s["cgpa"]*0.3 +
        s["coding_score"]*0.2 +
        s["aptitude_score"]*0.15 +
        s["communication_score"]*0.15 +
        s["projects"]*0.1 +
        s["internships"]*0.1,
        2
    )
