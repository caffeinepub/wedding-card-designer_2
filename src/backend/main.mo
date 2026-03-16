import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";


actor {
  public type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  public type Session = {
    id : Nat;
    messages : [Message];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module Session {
    public func compareById(a : Session, b : Session) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let sessions = Map.empty<Nat, Session>();

  public shared ({ caller }) func saveSession(
    id : Nat,
    messages : [Message],
  ) : async () {
    let now = Time.now();
    let session : Session = {
      id;
      messages;
      createdAt = now;
      updatedAt = now;
    };
    sessions.add(id, session);
  };

  public query ({ caller }) func getSession(id : Nat) : async Session {
    switch (sessions.get(id)) {
      case (null) { Runtime.trap("Could not find session with id " # id.toText()) };
      case (?session) { session };
    };
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    sessions.values().toArray();
  };

  public query ({ caller }) func getAllSessionsSortedById() : async [Session] {
    sessions.values().toArray().sort(Session.compareById);
  };

  public shared ({ caller }) func deleteSession(id : Nat) : async () {
    if (not sessions.containsKey(id)) {
      Runtime.trap("Could not find session with id " # id.toText());
    };
    sessions.remove(id);
  };

  public shared ({ caller }) func updateSession(
    id : Nat,
    messages : [Message],
  ) : async () {
    switch (sessions.get(id)) {
      case (null) { Runtime.trap("Could not find session with id " # id.toText()) };
      case (null) { Runtime.trap("Could not find session with id " # id.toText()) };
      case (?existingSession) {
        let updatedSession : Session = {
          id;
          messages;
          createdAt = existingSession.createdAt;
          updatedAt = Time.now();
        };
        sessions.add(id, updatedSession);
      };
    };
  };
};
