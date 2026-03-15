import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  public type Design = {
    id : Text;
    partner1Name : Text;
    partner2Name : Text;
    weddingDate : Text;
    venue : Text;
    message : Text;
    rsvpDetails : Text;
    templateId : Text;
    designName : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module Design {
    public func compareByName(a : Design, b : Design) : Order.Order {
      Text.compare(a.designName, b.designName);
    };
  };

  let designs = Map.empty<Text, Design>();

  public shared ({ caller }) func saveDesign(
    partner1Name : Text,
    partner2Name : Text,
    weddingDate : Text,
    venue : Text,
    message : Text,
    rsvpDetails : Text,
    templateId : Text,
    designName : Text,
  ) : async Text {
    let id = partner1Name.concat(partner2Name).concat(Time.now().toText());
    let timestamp = Time.now();

    let design : Design = {
      id;
      partner1Name;
      partner2Name;
      weddingDate;
      venue;
      message;
      rsvpDetails;
      templateId;
      designName;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    designs.add(id, design);
    id;
  };

  public query ({ caller }) func getDesign(id : Text) : async Design {
    switch (designs.get(id)) {
      case (null) { Runtime.trap("Design not found") };
      case (?design) { design };
    };
  };

  public query ({ caller }) func getAllDesigns() : async [Design] {
    designs.values().toArray();
  };

  public query ({ caller }) func getAllDesignsSortedByName() : async [Design] {
    designs.values().toArray().sort(Design.compareByName);
  };

  public shared ({ caller }) func deleteDesign(id : Text) : async () {
    if (not designs.containsKey(id)) {
      Runtime.trap("Design not found");
    };
    designs.remove(id);
  };

  public shared ({ caller }) func updateDesign(
    id : Text,
    partner1Name : Text,
    partner2Name : Text,
    weddingDate : Text,
    venue : Text,
    message : Text,
    rsvpDetails : Text,
    templateId : Text,
    designName : Text,
  ) : async () {
    switch (designs.get(id)) {
      case (null) { Runtime.trap("Design not found") };
      case (?existingDesign) {
        let updatedDesign : Design = {
          id;
          partner1Name;
          partner2Name;
          weddingDate;
          venue;
          message;
          rsvpDetails;
          templateId;
          designName;
          createdAt = existingDesign.createdAt;
          updatedAt = Time.now();
        };
        designs.add(id, updatedDesign);
      };
    };
  };
};
