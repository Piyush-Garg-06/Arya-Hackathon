import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";

actor {
  module CareerSession {
    public type SessionType = {
      careerPathName : Text;
      matchPercentage : Nat8;
      skills : [Text];
      timestamp : Time.Time;
    };

    public func compareByTimestamp(session1 : SessionType, session2 : SessionType) : Order.Order {
      Int.compare(session1.timestamp, session2.timestamp);
    };
  };

  module InterviewSession {
    public type SessionType = {
      interviewType : Text;
      score : Nat;
      feedback : Text;
      strengths : [Text];
      improvements : [Text];
      timestamp : Time.Time;
    };

    public func compareByTimestamp(session1 : SessionType, session2 : SessionType) : Order.Order {
      Int.compare(session1.timestamp, session2.timestamp);
    };
  };

  module LeaderboardEntry {
    public type EntryType = {
      username : Text;
      totalScore : Nat;
      sessionsCount : Nat;
      rank : Nat;
      badges : [Text];
    };

    public func compareByScore(entry1 : EntryType, entry2 : EntryType) : Order.Order {
      Nat.compare(entry2.totalScore, entry1.totalScore);
    };
  };

  type UserProfile = {
    username : Text;
    bio : Text;
    avatarUrl : Text;
    currentSituation : Text;
    quizAnswers : [Text];
  };

  type CareerSession = CareerSession.SessionType;
  type InterviewSession = InterviewSession.SessionType;
  type LeaderboardEntry = LeaderboardEntry.EntryType;

  let profiles = Map.empty<Principal, UserProfile>();
  let careerSessions = Map.empty<Principal, [CareerSession]>();
  let interviewSessions = Map.empty<Principal, [InterviewSession]>();
  let leaderboard = Map.empty<Principal, LeaderboardEntry>();

  public shared ({ caller }) func updateProfile(
    username : Text,
    bio : Text,
    avatarUrl : Text,
    currentSituation : Text,
    quizAnswers : [Text],
  ) : async () {
    let profile : UserProfile = {
      username;
      bio;
      avatarUrl;
      currentSituation;
      quizAnswers;
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func saveCareerSession(careerPathName : Text, matchPercentage : Nat8, skills : [Text]) : async () {
    let session : CareerSession = {
      careerPathName;
      matchPercentage;
      skills;
      timestamp = Time.now();
    };

    let existingSessions = switch (careerSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };

    let updatedSessions = [session].concat(existingSessions);
    careerSessions.add(caller, updatedSessions);
  };

  public shared ({ caller }) func saveInterviewSession(
    interviewType : Text,
    score : Nat,
    feedback : Text,
    strengths : [Text],
    improvements : [Text],
  ) : async () {
    let session : InterviewSession = {
      interviewType;
      score;
      feedback;
      strengths;
      improvements;
      timestamp = Time.now();
    };

    let existingSessions = switch (interviewSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };

    let updatedSessions = [session].concat(existingSessions);
    interviewSessions.add(caller, updatedSessions);
  };

  public query ({ caller }) func getUserProfile() : async UserProfile {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found for this user") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCareerSessions() : async [CareerSession] {
    switch (careerSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };
  };

  public query ({ caller }) func getInterviewSessions() : async [InterviewSession] {
    switch (interviewSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    let entries = leaderboard.values().toArray().sort(LeaderboardEntry.compareByScore);
    let length = if (entries.size() < 20) { entries.size() } else { 20 };
    Array.tabulate<LeaderboardEntry>(length, func(i) { entries[i] });
  };
};
