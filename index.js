document.addEventListener("DOMContentLoaded", () => {
  const memberData = {
    // Laser Tag Teams
    "Team A": [
      "아나이스",
      "브로디",
      "도큐",
      "아이린",
      "제니퍼",
      "로지",
      "시드",
      "윌리엄",
    ],
    "Team B": ["엘사", "진도", "릴리", "미아", "미카엘", "소피아", "우디"],
    "Team C": ["아일라", "댄", "마이클", "엠제이", "팀", "토니", "라스"],

    // Healing Programs
    "마사지 A": {
      members: ["로지", "엘사", "브로디", "댄"],
      travel:
        "레이저 아레나에서 도보 10분, 또는 택시 기본요금 거리입니다. 멤버 잃어버리지 않고 잘 챙겨주세요!",
    },
    "마사지 B": {
      members: ["윌리엄", "아일라", "진도", "도큐"],
      travel:
        "레이저 아레나에서 택시로 약 10-15분 소요됩니다. 멤버 잃어버리지 않고 잘 챙겨주세요!",
    },
    "가족 공예": {
      members: [
        "소피아",
        "토니",
        "미아",
        "릴리",
        "미카엘",
        "마이클",
        "시드",
        "팀",
        "라스",
        "아이린",
        "우디",
        "엠제이",
        "아나이스",
        "제니퍼",
      ],
      travel:
        "레이저 아레나에서 택시로 약 15-20분 소요됩니다. 인원이 많으니 2-3대 택시를 함께 잡아 이동하세요!",
    },
  };

  // Generate lookup maps from the single source of truth
  const programMap = {};
  const teamMap = {};
  Object.keys(memberData).forEach((groupName) => {
    if (groupName.startsWith("Team")) {
      memberData[groupName].forEach((ldap) => {
        teamMap[ldap] = groupName;
      });
    } else if (memberData[groupName].members) {
      // Healing program
      memberData[groupName].members.forEach((ldap) => {
        programMap[ldap] = groupName;
      });
    }
  });

  // Get DOM elements
  const ldapInput = document.getElementById("ldapInput");
  const searchBtn = document.getElementById("searchBtn");
  const showAllBtn = document.getElementById("showAllBtn");
  const scheduleItems = document.querySelectorAll(".schedule-item");
  const laserTeamInfo = document.getElementById("laser-team-info");
  const allPersonalInfoDivs = document.querySelectorAll(".personal-info");

  const hideAllPersonalInfo = () => {
    laserTeamInfo.classList.add("hidden");
    allPersonalInfoDivs.forEach((div) => div.classList.add("hidden"));
  };

  // 개인 스케줄 보여주는 함수
  const showPersonalSchedule = () => {
    hideAllPersonalInfo();
    const ldapId = ldapInput.value.toLowerCase().trim();
    const personalProgram = programMap[ldapId];
    const personalTeam = teamMap[ldapId];

    // 모든 힐링 프로그램 숨기기
    scheduleItems.forEach((item) => item.classList.remove("visible"));

    if (personalProgram && personalTeam) {
      // Show team info
      const teamMembers = memberData[personalTeam];
      document.querySelector("#team-name").innerHTML =
        `<i class="fas fa-users mr-2"></i> ${personalTeam} 멤버`;
      document.getElementById("team-members").textContent =
        teamMembers.join(", ");
      laserTeamInfo.classList.remove("hidden");

      // 해당하는 힐링 프로그램만 보이기
      const programElement = document.querySelector(
        `[data-program="${personalProgram}"]`
      );
      if (programElement) {
        programElement.classList.add("visible");
        const programData = memberData[personalProgram];
        const personalInfoDiv = programElement.querySelector(".personal-info");
        personalInfoDiv.querySelector(".member-list").textContent =
          programData.members.join(", ");
        personalInfoDiv.querySelector(".travel-info").textContent =
          programData.travel;
        personalInfoDiv.classList.remove("hidden");
      }
      showMessage(`"${ldapId}" 님의 스케줄입니다.`);
    } else {
      showMessage(
        "ID를 찾을 수 없습니다. 다시 시도하거나 전체 일정을 확인하세요."
      );
      showAllSchedule();
    }
  };

  // 전체 스케줄 보여주는 함수
  const showAllSchedule = () => {
    hideAllPersonalInfo();
    scheduleItems.forEach((item) => item.classList.add("visible"));
    ldapInput.value = "";
    showMessage("전체 플레이샵 일정입니다.");
  };

  // 메시지 표시 함수 (alert 대신 사용)
  const showMessage = (msg) => {
    let msgBox = document.getElementById("messageBox");
    if (!msgBox) {
      msgBox = document.createElement("div");
      msgBox.id = "messageBox";
      msgBox.className =
        "fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform -translate-y-0 opacity-0";
      document.body.appendChild(msgBox);
    }
    msgBox.textContent = msg;
    msgBox.classList.remove("opacity-0", "-translate-y-0");
    msgBox.classList.add("opacity-100", "-translate-y-4");
    setTimeout(() => {
      msgBox.classList.remove("opacity-100", "-translate-y-4");
      msgBox.classList.add("opacity-0", "-translate-y-0");
    }, 3000);
  };

  searchBtn.addEventListener("click", showPersonalSchedule);
  ldapInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      showPersonalSchedule();
    }
  });
  showAllBtn.addEventListener("click", showAllSchedule);

  // 페이지 로드 시 전체 일정 표시
  showAllSchedule();
});
