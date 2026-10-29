/**
 * Extended Master Dataset: 200+ Members, Households, Policies, and Claims
 * Auto-generated on demand for Healthcare Member Search & Eligibility Service.
 */

import { Customer, Policy, Claim } from '../types';

export const EXTENDED_CUSTOMERS: Customer[] = [
  {
    "_id": "cust-1001",
    "familyPolicyNumber": "POL-2026-1001",
    "familyHcid": "HCID-1001-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1001",
      "hcid": "HCID-1001-A",
      "firstName": "Patricia",
      "lastName": "Johnson",
      "dob": "1982-02-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1002",
        "hcid": "HCID-1002-B",
        "firstName": "David",
        "lastName": "Johnson",
        "dob": "1983-05-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1003",
        "hcid": "HCID-1003-C",
        "firstName": "Susan",
        "lastName": "Johnson",
        "dob": "2012-07-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "112 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 117-2002",
      "email": "patricia.johnson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1002",
    "familyPolicyNumber": "POL-2026-1002",
    "familyHcid": "HCID-1002-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1004",
      "hcid": "HCID-1004-A",
      "firstName": "Michael",
      "lastName": "Williams",
      "dob": "1983-03-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1005",
        "hcid": "HCID-1005-B",
        "firstName": "Jessica",
        "lastName": "Williams",
        "dob": "1984-06-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1006",
        "hcid": "HCID-1006-C",
        "firstName": "Matthew",
        "lastName": "Williams",
        "dob": "2013-08-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "124 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 134-2004",
      "email": "michael.williams@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1003",
    "familyPolicyNumber": "POL-2026-1003",
    "familyHcid": "HCID-1003-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1007",
      "hcid": "HCID-1007-A",
      "firstName": "Elizabeth",
      "lastName": "Brown",
      "dob": "1984-04-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1008",
        "hcid": "HCID-1008-B",
        "firstName": "Daniel",
        "lastName": "Brown",
        "dob": "1985-07-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1009",
        "hcid": "HCID-1009-C",
        "firstName": "Emily",
        "lastName": "Brown",
        "dob": "2014-09-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1010",
        "hcid": "HCID-1010-P",
        "firstName": "Brian",
        "lastName": "Brown",
        "dob": "1954-06-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "136 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 151-2006",
      "email": "elizabeth.brown@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1004",
    "familyPolicyNumber": "POL-2026-1004",
    "familyHcid": "HCID-1004-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1011",
      "hcid": "HCID-1011-A",
      "firstName": "Richard",
      "lastName": "Jones",
      "dob": "1985-05-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1012",
        "hcid": "HCID-1012-B",
        "firstName": "Sandra",
        "lastName": "Jones",
        "dob": "1986-08-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1013",
        "hcid": "HCID-1013-C",
        "firstName": "George",
        "lastName": "Jones",
        "dob": "2015-01-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "148 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 168-2008",
      "email": "richard.jones@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1005",
    "familyPolicyNumber": "POL-2026-1005",
    "familyHcid": "HCID-1005-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1014",
      "hcid": "HCID-1014-A",
      "firstName": "Jessica",
      "lastName": "Garcia",
      "dob": "1986-06-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1015",
        "hcid": "HCID-1015-B",
        "firstName": "Andrew",
        "lastName": "Garcia",
        "dob": "1987-09-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1016",
        "hcid": "HCID-1016-C",
        "firstName": "Laura",
        "lastName": "Garcia",
        "dob": "2016-02-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "160 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 185-2010",
      "email": "jessica.garcia@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1006",
    "familyPolicyNumber": "POL-2026-1006",
    "familyHcid": "HCID-1006-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1017",
      "hcid": "HCID-1017-A",
      "firstName": "Charles",
      "lastName": "Miller",
      "dob": "1987-07-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1018",
        "hcid": "HCID-1018-B",
        "firstName": "Carol",
        "lastName": "Miller",
        "dob": "1988-01-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1019",
        "hcid": "HCID-1019-C",
        "firstName": "Jonathan",
        "lastName": "Miller",
        "dob": "2017-03-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1020",
        "hcid": "HCID-1020-P",
        "firstName": "Katherine",
        "lastName": "Miller",
        "dob": "1957-09-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "172 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 202-2012",
      "email": "charles.miller@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1007",
    "familyPolicyNumber": "POL-2026-1007",
    "familyHcid": "HCID-1007-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1021",
      "hcid": "HCID-1021-A",
      "firstName": "Nancy",
      "lastName": "Davis",
      "dob": "1988-08-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1022",
        "hcid": "HCID-1022-B",
        "firstName": "Ronald",
        "lastName": "Davis",
        "dob": "1989-02-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1023",
        "hcid": "HCID-1023-C",
        "firstName": "Emma",
        "lastName": "Davis",
        "dob": "2018-04-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "184 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 219-2014",
      "email": "nancy.davis@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1008",
    "familyPolicyNumber": "POL-2026-1008",
    "familyHcid": "HCID-1008-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1024",
      "hcid": "HCID-1024-A",
      "firstName": "Matthew",
      "lastName": "Rodriguez",
      "dob": "1989-09-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1025",
        "hcid": "HCID-1025-B",
        "firstName": "Laura",
        "lastName": "Rodriguez",
        "dob": "19810-03-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1026",
        "hcid": "HCID-1026-C",
        "firstName": "Patrick",
        "lastName": "Rodriguez",
        "dob": "2011-05-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "196 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 236-2016",
      "email": "matthew.rodriguez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1009",
    "familyPolicyNumber": "POL-2026-1009",
    "familyHcid": "HCID-1009-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1027",
      "hcid": "HCID-1027-A",
      "firstName": "Margaret",
      "lastName": "Martinez",
      "dob": "19810-01-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1028",
        "hcid": "HCID-1028-B",
        "firstName": "Nicholas",
        "lastName": "Martinez",
        "dob": "19811-04-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1029",
        "hcid": "HCID-1029-C",
        "firstName": "Heather",
        "lastName": "Martinez",
        "dob": "2012-06-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1030",
        "hcid": "HCID-1030-P",
        "firstName": "Charles",
        "lastName": "Martinez",
        "dob": "1951-03-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "208 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 253-2018",
      "email": "margaret.martinez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1010",
    "familyPolicyNumber": "POL-2026-1010",
    "familyHcid": "HCID-1010-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1031",
      "hcid": "HCID-1031-A",
      "firstName": "Donald",
      "lastName": "Hernandez",
      "dob": "1981-02-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1032",
        "hcid": "HCID-1032-B",
        "firstName": "Anna",
        "lastName": "Hernandez",
        "dob": "1982-05-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1033",
        "hcid": "HCID-1033-C",
        "firstName": "David",
        "lastName": "Hernandez",
        "dob": "2013-07-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "220 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 270-2020",
      "email": "donald.hernandez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1011",
    "familyPolicyNumber": "POL-2026-1011",
    "familyHcid": "HCID-1011-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1034",
      "hcid": "HCID-1034-A",
      "firstName": "Kimberly",
      "lastName": "Lopez",
      "dob": "1982-03-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1035",
        "hcid": "HCID-1035-B",
        "firstName": "Brandon",
        "lastName": "Lopez",
        "dob": "1983-06-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1036",
        "hcid": "HCID-1036-C",
        "firstName": "Karen",
        "lastName": "Lopez",
        "dob": "2014-08-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "232 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 287-2022",
      "email": "kimberly.lopez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1012",
    "familyPolicyNumber": "POL-2026-1012",
    "familyHcid": "HCID-1012-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1037",
      "hcid": "HCID-1037-A",
      "firstName": "Andrew",
      "lastName": "Gonzalez",
      "dob": "1983-04-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1038",
        "hcid": "HCID-1038-B",
        "firstName": "Christine",
        "lastName": "Gonzalez",
        "dob": "1984-07-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1039",
        "hcid": "HCID-1039-C",
        "firstName": "Donald",
        "lastName": "Gonzalez",
        "dob": "2015-09-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1040",
        "hcid": "HCID-1040-P",
        "firstName": "Laura",
        "lastName": "Gonzalez",
        "dob": "1954-06-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "244 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 304-2024",
      "email": "andrew.gonzalez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1013",
    "familyPolicyNumber": "POL-2026-1013",
    "familyHcid": "HCID-1013-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1041",
      "hcid": "HCID-1041-A",
      "firstName": "Michelle",
      "lastName": "Wilson",
      "dob": "1984-05-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1042",
        "hcid": "HCID-1042-B",
        "firstName": "Raymond",
        "lastName": "Wilson",
        "dob": "1985-08-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1043",
        "hcid": "HCID-1043-C",
        "firstName": "Dorothy",
        "lastName": "Wilson",
        "dob": "2016-01-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "256 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 321-2026",
      "email": "michelle.wilson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1014",
    "familyPolicyNumber": "POL-2026-1014",
    "familyHcid": "HCID-1014-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1044",
      "hcid": "HCID-1044-A",
      "firstName": "Kevin",
      "lastName": "Anderson",
      "dob": "1985-06-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1045",
        "hcid": "HCID-1045-B",
        "firstName": "Maria",
        "lastName": "Anderson",
        "dob": "1986-09-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1046",
        "hcid": "HCID-1046-C",
        "firstName": "Timothy",
        "lastName": "Anderson",
        "dob": "2017-02-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "268 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 338-2028",
      "email": "kevin.anderson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1015",
    "familyPolicyNumber": "POL-2026-1015",
    "familyHcid": "HCID-1015-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1047",
      "hcid": "HCID-1047-A",
      "firstName": "Amanda",
      "lastName": "Thomas",
      "dob": "1986-07-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1048",
        "hcid": "HCID-1048-B",
        "firstName": "Robert",
        "lastName": "Thomas",
        "dob": "1987-01-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1049",
        "hcid": "HCID-1049-C",
        "firstName": "Amy",
        "lastName": "Thomas",
        "dob": "2018-03-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1050",
        "hcid": "HCID-1050-P",
        "firstName": "Dennis",
        "lastName": "Thomas",
        "dob": "1957-09-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "280 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 355-2030",
      "email": "amanda.thomas@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1016",
    "familyPolicyNumber": "POL-2026-1016",
    "familyHcid": "HCID-1016-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1051",
      "hcid": "HCID-1051-A",
      "firstName": "Edward",
      "lastName": "Taylor",
      "dob": "1987-08-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1052",
        "hcid": "HCID-1052-B",
        "firstName": "Elizabeth",
        "lastName": "Taylor",
        "dob": "1988-02-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1053",
        "hcid": "HCID-1053-C",
        "firstName": "Justin",
        "lastName": "Taylor",
        "dob": "2011-04-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "292 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 372-2032",
      "email": "edward.taylor@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1017",
    "familyPolicyNumber": "POL-2026-1017",
    "familyHcid": "HCID-1017-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1054",
      "hcid": "HCID-1054-A",
      "firstName": "Stephanie",
      "lastName": "Moore",
      "dob": "1988-09-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1055",
        "hcid": "HCID-1055-B",
        "firstName": "Thomas",
        "lastName": "Moore",
        "dob": "1989-03-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1056",
        "hcid": "HCID-1056-C",
        "firstName": "Christine",
        "lastName": "Moore",
        "dob": "2012-05-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "304 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 389-2034",
      "email": "stephanie.moore@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1018",
    "familyPolicyNumber": "POL-2026-1018",
    "familyHcid": "HCID-1018-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1057",
      "hcid": "HCID-1057-A",
      "firstName": "Jason",
      "lastName": "Jackson",
      "dob": "1989-01-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1058",
        "hcid": "HCID-1058-B",
        "firstName": "Lisa",
        "lastName": "Jackson",
        "dob": "19810-04-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1059",
        "hcid": "HCID-1059-C",
        "firstName": "Dennis",
        "lastName": "Jackson",
        "dob": "2013-06-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1060",
        "hcid": "HCID-1060-P",
        "firstName": "Ashley",
        "lastName": "Jackson",
        "dob": "1951-03-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "316 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 406-2036",
      "email": "jason.jackson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1019",
    "familyPolicyNumber": "POL-2026-1019",
    "familyHcid": "HCID-1019-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1061",
      "hcid": "HCID-1061-A",
      "firstName": "Laura",
      "lastName": "Martin",
      "dob": "19810-02-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1062",
        "hcid": "HCID-1062-B",
        "firstName": "Donald",
        "lastName": "Martin",
        "dob": "19811-05-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1063",
        "hcid": "HCID-1063-C",
        "firstName": "Patricia",
        "lastName": "Martin",
        "dob": "2014-07-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "328 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 423-2038",
      "email": "laura.martin@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1020",
    "familyPolicyNumber": "POL-2026-1020",
    "familyHcid": "HCID-1020-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1064",
      "hcid": "HCID-1064-A",
      "firstName": "Jacob",
      "lastName": "Lee",
      "dob": "1981-03-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1065",
        "hcid": "HCID-1065-B",
        "firstName": "Donna",
        "lastName": "Lee",
        "dob": "1982-06-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1066",
        "hcid": "HCID-1066-C",
        "firstName": "Joseph",
        "lastName": "Lee",
        "dob": "2015-08-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "340 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 440-2040",
      "email": "jacob.lee@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1021",
    "familyPolicyNumber": "POL-2026-1021",
    "familyHcid": "HCID-1021-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1067",
      "hcid": "HCID-1067-A",
      "firstName": "Amy",
      "lastName": "Perez",
      "dob": "1982-04-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1068",
        "hcid": "HCID-1068-B",
        "firstName": "Brian",
        "lastName": "Perez",
        "dob": "1983-07-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1069",
        "hcid": "HCID-1069-C",
        "firstName": "Betty",
        "lastName": "Perez",
        "dob": "2016-09-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1070",
        "hcid": "HCID-1070-P",
        "firstName": "Stephen",
        "lastName": "Perez",
        "dob": "1954-06-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "352 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 457-2042",
      "email": "amy.perez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1022",
    "familyPolicyNumber": "POL-2026-1022",
    "familyHcid": "HCID-1022-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1071",
      "hcid": "HCID-1071-A",
      "firstName": "Eric",
      "lastName": "Thompson",
      "dob": "1983-05-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1072",
        "hcid": "HCID-1072-B",
        "firstName": "Stephanie",
        "lastName": "Thompson",
        "dob": "1984-08-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1073",
        "hcid": "HCID-1073-C",
        "firstName": "Andrew",
        "lastName": "Thompson",
        "dob": "2017-01-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "364 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 474-2044",
      "email": "eric.thompson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1023",
    "familyPolicyNumber": "POL-2026-1023",
    "familyHcid": "HCID-1023-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1074",
      "hcid": "HCID-1074-A",
      "firstName": "Helen",
      "lastName": "White",
      "dob": "1984-06-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1075",
        "hcid": "HCID-1075-B",
        "firstName": "Ryan",
        "lastName": "White",
        "dob": "1985-09-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1076",
        "hcid": "HCID-1076-C",
        "firstName": "Melissa",
        "lastName": "White",
        "dob": "2018-02-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "376 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 491-2046",
      "email": "helen.white@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1024",
    "familyPolicyNumber": "POL-2026-1024",
    "familyHcid": "HCID-1024-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1077",
      "hcid": "HCID-1077-A",
      "firstName": "Larry",
      "lastName": "Harris",
      "dob": "1985-07-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1078",
        "hcid": "HCID-1078-B",
        "firstName": "Shirley",
        "lastName": "Harris",
        "dob": "1986-01-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1079",
        "hcid": "HCID-1079-C",
        "firstName": "Ryan",
        "lastName": "Harris",
        "dob": "2011-03-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1080",
        "hcid": "HCID-1080-P",
        "firstName": "Jennifer",
        "lastName": "Harris",
        "dob": "1957-09-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "388 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 508-2048",
      "email": "larry.harris@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1025",
    "familyPolicyNumber": "POL-2026-1025",
    "familyHcid": "HCID-1025-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1081",
      "hcid": "HCID-1081-A",
      "firstName": "Pamela",
      "lastName": "Sanchez",
      "dob": "1986-08-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1082",
        "hcid": "HCID-1082-B",
        "firstName": "Larry",
        "lastName": "Sanchez",
        "dob": "1987-02-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1083",
        "hcid": "HCID-1083-C",
        "firstName": "Helen",
        "lastName": "Sanchez",
        "dob": "2012-04-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "400 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 525-2050",
      "email": "pamela.sanchez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1026",
    "familyPolicyNumber": "POL-2026-1026",
    "familyHcid": "HCID-1026-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1084",
      "hcid": "HCID-1084-A",
      "firstName": "Brandon",
      "lastName": "Clark",
      "dob": "1987-09-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1085",
        "hcid": "HCID-1085-B",
        "firstName": "Emma",
        "lastName": "Clark",
        "dob": "1988-03-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1086",
        "hcid": "HCID-1086-C",
        "firstName": "Benjamin",
        "lastName": "Clark",
        "dob": "2013-05-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "412 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 542-2052",
      "email": "brandon.clark@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1027",
    "familyPolicyNumber": "POL-2026-1027",
    "familyHcid": "HCID-1027-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1087",
      "hcid": "HCID-1087-A",
      "firstName": "Samantha",
      "lastName": "Ramirez",
      "dob": "1988-01-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1088",
        "hcid": "HCID-1088-B",
        "firstName": "Alexander",
        "lastName": "Ramirez",
        "dob": "1989-04-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1089",
        "hcid": "HCID-1089-C",
        "firstName": "Catherine",
        "lastName": "Ramirez",
        "dob": "2014-06-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1090",
        "hcid": "HCID-1090-P",
        "firstName": "Brian",
        "lastName": "Ramirez",
        "dob": "1951-03-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "424 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 559-2054",
      "email": "samantha.ramirez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1028",
    "familyPolicyNumber": "POL-2026-1028",
    "familyHcid": "HCID-1028-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1091",
      "hcid": "HCID-1091-A",
      "firstName": "Gregory",
      "lastName": "Lewis",
      "dob": "1989-02-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1092",
        "hcid": "HCID-1092-B",
        "firstName": "Carolyn",
        "lastName": "Lewis",
        "dob": "19810-05-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1093",
        "hcid": "HCID-1093-C",
        "firstName": "Aaron",
        "lastName": "Lewis",
        "dob": "2015-07-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "436 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 576-2056",
      "email": "gregory.lewis@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1029",
    "familyPolicyNumber": "POL-2026-1029",
    "familyHcid": "HCID-1029-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1094",
      "hcid": "HCID-1094-A",
      "firstName": "Debra",
      "lastName": "Robinson",
      "dob": "19810-03-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1095",
        "hcid": "HCID-1095-B",
        "firstName": "Tyler",
        "lastName": "Robinson",
        "dob": "19811-06-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1096",
        "hcid": "HCID-1096-C",
        "firstName": "Elizabeth",
        "lastName": "Robinson",
        "dob": "2016-08-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "448 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 593-2058",
      "email": "debra.robinson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1030",
    "familyPolicyNumber": "POL-2026-1030",
    "familyHcid": "HCID-1030-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1097",
      "hcid": "HCID-1097-A",
      "firstName": "Patrick",
      "lastName": "Walker",
      "dob": "1981-04-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1098",
        "hcid": "HCID-1098-B",
        "firstName": "Patricia",
        "lastName": "Walker",
        "dob": "1982-07-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1099",
        "hcid": "HCID-1099-C",
        "firstName": "Christopher",
        "lastName": "Walker",
        "dob": "2017-09-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1100",
        "hcid": "HCID-1100-P",
        "firstName": "Katherine",
        "lastName": "Walker",
        "dob": "1954-06-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "460 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 610-2060",
      "email": "patrick.walker@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1031",
    "familyPolicyNumber": "POL-2026-1031",
    "familyHcid": "HCID-1031-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1101",
      "hcid": "HCID-1101-A",
      "firstName": "Carolyn",
      "lastName": "Young",
      "dob": "1982-05-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1102",
        "hcid": "HCID-1102-B",
        "firstName": "William",
        "lastName": "Young",
        "dob": "1983-08-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1103",
        "hcid": "HCID-1103-C",
        "firstName": "Ashley",
        "lastName": "Young",
        "dob": "2018-01-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "472 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 627-2062",
      "email": "carolyn.young@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1032",
    "familyPolicyNumber": "POL-2026-1032",
    "familyHcid": "HCID-1032-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1104",
      "hcid": "HCID-1104-A",
      "firstName": "Dennis",
      "lastName": "Allen",
      "dob": "1983-06-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1105",
        "hcid": "HCID-1105-B",
        "firstName": "Sarah",
        "lastName": "Allen",
        "dob": "1984-09-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1106",
        "hcid": "HCID-1106-C",
        "firstName": "Kevin",
        "lastName": "Allen",
        "dob": "2011-02-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "484 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 644-2064",
      "email": "dennis.allen@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1033",
    "familyPolicyNumber": "POL-2026-1033",
    "familyHcid": "HCID-1033-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1107",
      "hcid": "HCID-1107-A",
      "firstName": "Maria",
      "lastName": "King",
      "dob": "1984-07-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1108",
        "hcid": "HCID-1108-B",
        "firstName": "Matthew",
        "lastName": "King",
        "dob": "1985-01-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1109",
        "hcid": "HCID-1109-C",
        "firstName": "Rebecca",
        "lastName": "King",
        "dob": "2012-03-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1110",
        "hcid": "HCID-1110-P",
        "firstName": "Charles",
        "lastName": "King",
        "dob": "1957-09-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "496 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 661-2066",
      "email": "maria.king@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1034",
    "familyPolicyNumber": "POL-2026-1034",
    "familyHcid": "HCID-1034-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1111",
      "hcid": "HCID-1111-A",
      "firstName": "Aaron",
      "lastName": "Wright",
      "dob": "1985-08-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1112",
        "hcid": "HCID-1112-B",
        "firstName": "Ashley",
        "lastName": "Wright",
        "dob": "1986-02-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1113",
        "hcid": "HCID-1113-C",
        "firstName": "Nicholas",
        "lastName": "Wright",
        "dob": "2013-04-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "508 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 678-2068",
      "email": "aaron.wright@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1035",
    "familyPolicyNumber": "POL-2026-1035",
    "familyHcid": "HCID-1035-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1114",
      "hcid": "HCID-1114-A",
      "firstName": "Mary",
      "lastName": "Scott",
      "dob": "1986-09-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1115",
        "hcid": "HCID-1115-B",
        "firstName": "Joshua",
        "lastName": "Scott",
        "dob": "1987-03-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1116",
        "hcid": "HCID-1116-C",
        "firstName": "Pamela",
        "lastName": "Scott",
        "dob": "2014-05-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "520 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 695-2070",
      "email": "mary.scott@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1036",
    "familyPolicyNumber": "POL-2026-1036",
    "familyHcid": "HCID-1036-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1117",
      "hcid": "HCID-1117-A",
      "firstName": "John",
      "lastName": "Torres",
      "dob": "1987-01-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1118",
        "hcid": "HCID-1118-B",
        "firstName": "Amanda",
        "lastName": "Torres",
        "dob": "1988-04-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1119",
        "hcid": "HCID-1119-C",
        "firstName": "Alexander",
        "lastName": "Torres",
        "dob": "2015-06-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1120",
        "hcid": "HCID-1120-P",
        "firstName": "Laura",
        "lastName": "Torres",
        "dob": "1951-03-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "532 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 712-2072",
      "email": "john.torres@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1037",
    "familyPolicyNumber": "POL-2026-1037",
    "familyHcid": "HCID-1037-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1121",
      "hcid": "HCID-1121-A",
      "firstName": "Linda",
      "lastName": "Nguyen",
      "dob": "1988-02-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1122",
        "hcid": "HCID-1122-B",
        "firstName": "Timothy",
        "lastName": "Nguyen",
        "dob": "1989-05-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1123",
        "hcid": "HCID-1123-C",
        "firstName": "Ruth",
        "lastName": "Nguyen",
        "dob": "2016-07-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "544 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 729-2074",
      "email": "linda.nguyen@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1038",
    "familyPolicyNumber": "POL-2026-1038",
    "familyHcid": "HCID-1038-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1124",
      "hcid": "HCID-1124-A",
      "firstName": "William",
      "lastName": "Hill",
      "dob": "1989-03-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1125",
        "hcid": "HCID-1125-B",
        "firstName": "Cynthia",
        "lastName": "Hill",
        "dob": "19810-06-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1126",
        "hcid": "HCID-1126-C",
        "firstName": "John",
        "lastName": "Hill",
        "dob": "2017-08-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "556 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 746-2076",
      "email": "william.hill@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1039",
    "familyPolicyNumber": "POL-2026-1039",
    "familyHcid": "HCID-1039-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1127",
      "hcid": "HCID-1127-A",
      "firstName": "Susan",
      "lastName": "Flores",
      "dob": "19810-04-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1128",
        "hcid": "HCID-1128-B",
        "firstName": "Eric",
        "lastName": "Flores",
        "dob": "19811-07-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1129",
        "hcid": "HCID-1129-C",
        "firstName": "Jessica",
        "lastName": "Flores",
        "dob": "2018-09-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1130",
        "hcid": "HCID-1130-P",
        "firstName": "Dennis",
        "lastName": "Flores",
        "dob": "1954-06-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "568 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 763-2078",
      "email": "susan.flores@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1040",
    "familyPolicyNumber": "POL-2026-1040",
    "familyHcid": "HCID-1040-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1131",
      "hcid": "HCID-1131-A",
      "firstName": "Thomas",
      "lastName": "Green",
      "dob": "1981-05-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1132",
        "hcid": "HCID-1132-B",
        "firstName": "Brenda",
        "lastName": "Green",
        "dob": "1982-08-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1133",
        "hcid": "HCID-1133-C",
        "firstName": "Anthony",
        "lastName": "Green",
        "dob": "2011-01-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "580 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 780-2080",
      "email": "thomas.green@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1041",
    "familyPolicyNumber": "POL-2026-1041",
    "familyHcid": "HCID-1041-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1134",
      "hcid": "HCID-1134-A",
      "firstName": "Karen",
      "lastName": "Adams",
      "dob": "1982-06-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1135",
        "hcid": "HCID-1135-B",
        "firstName": "Benjamin",
        "lastName": "Adams",
        "dob": "1983-09-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1136",
        "hcid": "HCID-1136-C",
        "firstName": "Donna",
        "lastName": "Adams",
        "dob": "2012-02-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "592 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 797-2082",
      "email": "karen.adams@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1042",
    "familyPolicyNumber": "POL-2026-1042",
    "familyHcid": "HCID-1042-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1137",
      "hcid": "HCID-1137-A",
      "firstName": "Daniel",
      "lastName": "Nelson",
      "dob": "1983-07-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1138",
        "hcid": "HCID-1138-B",
        "firstName": "Debra",
        "lastName": "Nelson",
        "dob": "1984-01-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1139",
        "hcid": "HCID-1139-C",
        "firstName": "Edward",
        "lastName": "Nelson",
        "dob": "2013-03-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1140",
        "hcid": "HCID-1140-P",
        "firstName": "Ashley",
        "lastName": "Nelson",
        "dob": "1957-09-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "604 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 814-2084",
      "email": "daniel.nelson@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1043",
    "familyPolicyNumber": "POL-2026-1043",
    "familyHcid": "HCID-1043-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1141",
      "hcid": "HCID-1141-A",
      "firstName": "Betty",
      "lastName": "Baker",
      "dob": "1984-08-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1142",
        "hcid": "HCID-1142-B",
        "firstName": "Jack",
        "lastName": "Baker",
        "dob": "1985-02-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1143",
        "hcid": "HCID-1143-C",
        "firstName": "Cynthia",
        "lastName": "Baker",
        "dob": "2014-04-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "616 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 831-2086",
      "email": "betty.baker@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1044",
    "familyPolicyNumber": "POL-2026-1044",
    "familyHcid": "HCID-1044-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1144",
      "hcid": "HCID-1144-A",
      "firstName": "Mark",
      "lastName": "Hall",
      "dob": "1985-09-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1145",
        "hcid": "HCID-1145-B",
        "firstName": "Heather",
        "lastName": "Hall",
        "dob": "1986-03-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1146",
        "hcid": "HCID-1146-C",
        "firstName": "Stephen",
        "lastName": "Hall",
        "dob": "2015-05-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "628 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 848-2088",
      "email": "mark.hall@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1045",
    "familyPolicyNumber": "POL-2026-1045",
    "familyHcid": "HCID-1045-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1147",
      "hcid": "HCID-1147-A",
      "firstName": "Ashley",
      "lastName": "Rivera",
      "dob": "1986-01-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1148",
        "hcid": "HCID-1148-B",
        "firstName": "John",
        "lastName": "Rivera",
        "dob": "1987-04-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1149",
        "hcid": "HCID-1149-C",
        "firstName": "Samantha",
        "lastName": "Rivera",
        "dob": "2016-06-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1150",
        "hcid": "HCID-1150-P",
        "firstName": "Stephen",
        "lastName": "Rivera",
        "dob": "1951-03-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "640 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 865-2090",
      "email": "ashley.rivera@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1046",
    "familyPolicyNumber": "POL-2026-1046",
    "familyHcid": "HCID-1046-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1151",
      "hcid": "HCID-1151-A",
      "firstName": "Paul",
      "lastName": "Campbell",
      "dob": "1987-02-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1152",
        "hcid": "HCID-1152-B",
        "firstName": "Barbara",
        "lastName": "Campbell",
        "dob": "1988-05-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1153",
        "hcid": "HCID-1153-C",
        "firstName": "Raymond",
        "lastName": "Campbell",
        "dob": "2017-07-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "652 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 882-2092",
      "email": "paul.campbell@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1047",
    "familyPolicyNumber": "POL-2026-1047",
    "familyHcid": "HCID-1047-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1154",
      "hcid": "HCID-1154-A",
      "firstName": "Donna",
      "lastName": "Mitchell",
      "dob": "1988-03-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1155",
        "hcid": "HCID-1155-B",
        "firstName": "Charles",
        "lastName": "Mitchell",
        "dob": "1989-06-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1156",
        "hcid": "HCID-1156-C",
        "firstName": "Diane",
        "lastName": "Mitchell",
        "dob": "2018-08-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "664 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 899-2094",
      "email": "donna.mitchell@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1048",
    "familyPolicyNumber": "POL-2026-1048",
    "familyHcid": "HCID-1048-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1157",
      "hcid": "HCID-1157-A",
      "firstName": "Kenneth",
      "lastName": "Carter",
      "dob": "1989-04-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1158",
        "hcid": "HCID-1158-B",
        "firstName": "Betty",
        "lastName": "Carter",
        "dob": "19810-07-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1159",
        "hcid": "HCID-1159-C",
        "firstName": "William",
        "lastName": "Carter",
        "dob": "2011-09-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1160",
        "hcid": "HCID-1160-P",
        "firstName": "Jennifer",
        "lastName": "Carter",
        "dob": "1954-06-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "676 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 916-2096",
      "email": "kenneth.carter@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1049",
    "familyPolicyNumber": "POL-2026-1049",
    "familyHcid": "HCID-1049-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1161",
      "hcid": "HCID-1161-A",
      "firstName": "Carol",
      "lastName": "Roberts",
      "dob": "19810-05-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1162",
        "hcid": "HCID-1162-B",
        "firstName": "Steven",
        "lastName": "Roberts",
        "dob": "19811-08-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1163",
        "hcid": "HCID-1163-C",
        "firstName": "Nancy",
        "lastName": "Roberts",
        "dob": "2012-01-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "688 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 933-2098",
      "email": "carol.roberts@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1050",
    "familyPolicyNumber": "POL-2026-1050",
    "familyHcid": "HCID-1050-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1164",
      "hcid": "HCID-1164-A",
      "firstName": "George",
      "lastName": "Gomez",
      "dob": "1981-06-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1165",
        "hcid": "HCID-1165-B",
        "firstName": "Michelle",
        "lastName": "Gomez",
        "dob": "1982-09-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1166",
        "hcid": "HCID-1166-C",
        "firstName": "Steven",
        "lastName": "Gomez",
        "dob": "2013-02-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "700 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 950-2100",
      "email": "george.gomez@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1051",
    "familyPolicyNumber": "POL-2026-1051",
    "familyHcid": "HCID-1051-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1167",
      "hcid": "HCID-1167-A",
      "firstName": "Deborah",
      "lastName": "Phillips",
      "dob": "1982-07-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1168",
        "hcid": "HCID-1168-B",
        "firstName": "George",
        "lastName": "Phillips",
        "dob": "1983-01-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1169",
        "hcid": "HCID-1169-C",
        "firstName": "Carol",
        "lastName": "Phillips",
        "dob": "2014-03-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1170",
        "hcid": "HCID-1170-P",
        "firstName": "Brian",
        "lastName": "Phillips",
        "dob": "1957-09-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "712 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 967-2102",
      "email": "deborah.phillips@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1052",
    "familyPolicyNumber": "POL-2026-1052",
    "familyHcid": "HCID-1052-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1171",
      "hcid": "HCID-1171-A",
      "firstName": "Timothy",
      "lastName": "Evans",
      "dob": "1983-08-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1172",
        "hcid": "HCID-1172-B",
        "firstName": "Rebecca",
        "lastName": "Evans",
        "dob": "1984-02-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1173",
        "hcid": "HCID-1173-C",
        "firstName": "Jason",
        "lastName": "Evans",
        "dob": "2015-04-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "724 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 984-2104",
      "email": "timothy.evans@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1053",
    "familyPolicyNumber": "POL-2026-1053",
    "familyHcid": "HCID-1053-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1174",
      "hcid": "HCID-1174-A",
      "firstName": "Sharon",
      "lastName": "Turner",
      "dob": "1984-09-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1175",
        "hcid": "HCID-1175-B",
        "firstName": "Jacob",
        "lastName": "Turner",
        "dob": "1985-03-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1176",
        "hcid": "HCID-1176-C",
        "firstName": "Shirley",
        "lastName": "Turner",
        "dob": "2016-05-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "736 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 1001-2106",
      "email": "sharon.turner@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1054",
    "familyPolicyNumber": "POL-2026-1054",
    "familyHcid": "HCID-1054-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1177",
      "hcid": "HCID-1177-A",
      "firstName": "Ryan",
      "lastName": "Diaz",
      "dob": "1985-01-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1178",
        "hcid": "HCID-1178-B",
        "firstName": "Angela",
        "lastName": "Diaz",
        "dob": "1986-04-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1179",
        "hcid": "HCID-1179-C",
        "firstName": "Scott",
        "lastName": "Diaz",
        "dob": "2017-06-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1180",
        "hcid": "HCID-1180-P",
        "firstName": "Katherine",
        "lastName": "Diaz",
        "dob": "1951-03-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "748 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 1018-2108",
      "email": "ryan.diaz@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1055",
    "familyPolicyNumber": "POL-2026-1055",
    "familyHcid": "HCID-1055-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1181",
      "hcid": "HCID-1181-A",
      "firstName": "Kathleen",
      "lastName": "Parker",
      "dob": "1986-02-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1182",
        "hcid": "HCID-1182-B",
        "firstName": "Justin",
        "lastName": "Parker",
        "dob": "1987-05-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1183",
        "hcid": "HCID-1183-C",
        "firstName": "Debra",
        "lastName": "Parker",
        "dob": "2018-07-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "760 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 1035-2110",
      "email": "kathleen.parker@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1056",
    "familyPolicyNumber": "POL-2026-1056",
    "familyHcid": "HCID-1056-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1184",
      "hcid": "HCID-1184-A",
      "firstName": "Nicholas",
      "lastName": "Cruz",
      "dob": "1987-03-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1185",
        "hcid": "HCID-1185-B",
        "firstName": "Samantha",
        "lastName": "Cruz",
        "dob": "1988-06-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1186",
        "hcid": "HCID-1186-C",
        "firstName": "Jerry",
        "lastName": "Cruz",
        "dob": "2011-08-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "772 Oak Valley Parkway, Atlanta, GA 30303",
      "phone": "(555) 1052-2112",
      "email": "nicholas.cruz@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1057",
    "familyPolicyNumber": "POL-2026-1057",
    "familyHcid": "HCID-1057-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1187",
      "hcid": "HCID-1187-A",
      "firstName": "Angela",
      "lastName": "Edwards",
      "dob": "1988-04-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1188",
        "hcid": "HCID-1188-B",
        "firstName": "Frank",
        "lastName": "Edwards",
        "dob": "1989-07-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1189",
        "hcid": "HCID-1189-C",
        "firstName": "Jennifer",
        "lastName": "Edwards",
        "dob": "2012-09-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1190",
        "hcid": "HCID-1190-P",
        "firstName": "Charles",
        "lastName": "Edwards",
        "dob": "1954-06-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "784 Oak Valley Parkway, Boston, MA 02108",
      "phone": "(555) 1069-2114",
      "email": "angela.edwards@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1058",
    "familyPolicyNumber": "POL-2026-1058",
    "familyHcid": "HCID-1058-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1191",
      "hcid": "HCID-1191-A",
      "firstName": "Stephen",
      "lastName": "Collins",
      "dob": "1989-05-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1192",
        "hcid": "HCID-1192-B",
        "firstName": "Janet",
        "lastName": "Collins",
        "dob": "19810-08-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1193",
        "hcid": "HCID-1193-C",
        "firstName": "Thomas",
        "lastName": "Collins",
        "dob": "2013-01-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "796 Oak Valley Parkway, Phoenix, AZ 85001",
      "phone": "(555) 1086-2116",
      "email": "stephen.collins@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1059",
    "familyPolicyNumber": "POL-2026-1059",
    "familyHcid": "HCID-1059-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1194",
      "hcid": "HCID-1194-A",
      "firstName": "Brenda",
      "lastName": "Reyes",
      "dob": "19810-06-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1195",
        "hcid": "HCID-1195-B",
        "firstName": "Aaron",
        "lastName": "Reyes",
        "dob": "19811-09-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1196",
        "hcid": "HCID-1196-C",
        "firstName": "Margaret",
        "lastName": "Reyes",
        "dob": "2014-02-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "808 Oak Valley Parkway, Charlotte, NC 28202",
      "phone": "(555) 1103-2118",
      "email": "brenda.reyes@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1060",
    "familyPolicyNumber": "POL-2026-1060",
    "familyHcid": "HCID-1060-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1197",
      "hcid": "HCID-1197-A",
      "firstName": "Scott",
      "lastName": "Stewart",
      "dob": "1981-07-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1198",
        "hcid": "HCID-1198-B",
        "firstName": "Jennifer",
        "lastName": "Stewart",
        "dob": "1982-01-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1199",
        "hcid": "HCID-1199-C",
        "firstName": "Joshua",
        "lastName": "Stewart",
        "dob": "2015-03-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1200",
        "hcid": "HCID-1200-P",
        "firstName": "Laura",
        "lastName": "Stewart",
        "dob": "1957-09-05",
        "gender": "MALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "820 Oak Valley Parkway, Springfield, IL 62701",
      "phone": "(555) 1120-2120",
      "email": "scott.stewart@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1061",
    "familyPolicyNumber": "POL-2026-1061",
    "familyHcid": "HCID-1061-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1201",
      "hcid": "HCID-1201-A",
      "firstName": "Emma",
      "lastName": "Morris",
      "dob": "1982-08-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1202",
        "hcid": "HCID-1202-B",
        "firstName": "Richard",
        "lastName": "Morris",
        "dob": "1983-02-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1203",
        "hcid": "HCID-1203-C",
        "firstName": "Deborah",
        "lastName": "Morris",
        "dob": "2016-04-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "832 Oak Valley Parkway, Chicago, IL 60601",
      "phone": "(555) 1137-2122",
      "email": "emma.morris@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1062",
    "familyPolicyNumber": "POL-2026-1062",
    "familyHcid": "HCID-1062-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1204",
      "hcid": "HCID-1204-A",
      "firstName": "Samuel",
      "lastName": "Morales",
      "dob": "1983-09-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1205",
        "hcid": "HCID-1205-B",
        "firstName": "Karen",
        "lastName": "Morales",
        "dob": "1984-03-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1206",
        "hcid": "HCID-1206-C",
        "firstName": "Jacob",
        "lastName": "Morales",
        "dob": "2017-05-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "844 Oak Valley Parkway, Austin, TX 78701",
      "phone": "(555) 1154-2124",
      "email": "samuel.morales@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1063",
    "familyPolicyNumber": "POL-2026-1063",
    "familyHcid": "HCID-1063-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1207",
      "hcid": "HCID-1207-A",
      "firstName": "Christine",
      "lastName": "Murphy",
      "dob": "1984-01-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1208",
        "hcid": "HCID-1208-B",
        "firstName": "Anthony",
        "lastName": "Murphy",
        "dob": "1985-04-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1209",
        "hcid": "HCID-1209-C",
        "firstName": "Anna",
        "lastName": "Murphy",
        "dob": "2018-06-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1210",
        "hcid": "HCID-1210-P",
        "firstName": "Dennis",
        "lastName": "Murphy",
        "dob": "1951-03-05",
        "gender": "FEMALE",
        "relationship": "PARENT",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "856 Oak Valley Parkway, Columbus, OH 43215",
      "phone": "(555) 1171-2126",
      "email": "christine.murphy@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1064",
    "familyPolicyNumber": "POL-2026-1064",
    "familyHcid": "HCID-1064-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1211",
      "hcid": "HCID-1211-A",
      "firstName": "Frank",
      "lastName": "Cook",
      "dob": "1985-02-15",
      "gender": "MALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1212",
        "hcid": "HCID-1212-B",
        "firstName": "Kimberly",
        "lastName": "Cook",
        "dob": "1986-05-20",
        "gender": "FEMALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1213",
        "hcid": "HCID-1213-C",
        "firstName": "Samuel",
        "lastName": "Cook",
        "dob": "2011-07-10",
        "gender": "FEMALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "868 Oak Valley Parkway, Seattle, WA 98101",
      "phone": "(555) 1188-2128",
      "email": "frank.cook@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "_id": "cust-1065",
    "familyPolicyNumber": "POL-2026-1065",
    "familyHcid": "HCID-1065-HOUSEHOLD",
    "primarySubscriber": {
      "memberId": "MEM-1214",
      "hcid": "HCID-1214-A",
      "firstName": "Catherine",
      "lastName": "Rogers",
      "dob": "1986-03-15",
      "gender": "FEMALE",
      "relationship": "PRIMARY_SUBSCRIBER",
      "coverageStatus": "ACTIVE"
    },
    "dependents": [
      {
        "memberId": "MEM-1215",
        "hcid": "HCID-1215-B",
        "firstName": "Kenneth",
        "lastName": "Rogers",
        "dob": "1987-06-20",
        "gender": "MALE",
        "relationship": "SPOUSE",
        "coverageStatus": "ACTIVE"
      },
      {
        "memberId": "MEM-1216",
        "hcid": "HCID-1216-C",
        "firstName": "Carolyn",
        "lastName": "Rogers",
        "dob": "2012-08-10",
        "gender": "MALE",
        "relationship": "CHILD",
        "coverageStatus": "ACTIVE"
      }
    ],
    "contact": {
      "address": "880 Oak Valley Parkway, Denver, CO 80202",
      "phone": "(555) 1205-2130",
      "email": "catherine.rogers@healthmail.com"
    },
    "createdAt": "2026-01-10T08:00:00Z"
  }
];
export const EXTENDED_POLICIES: Policy[] = [
  {
    "_id": "pol-1001",
    "policyNumber": "POL-2026-1001",
    "planName": "Gold Choice Value Managed Care (Household 1001)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 875,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 1225
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1002",
    "policyNumber": "POL-2026-1002",
    "planName": "Silver Select Essential HMO (Household 1002)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1003",
    "policyNumber": "POL-2026-1003",
    "planName": "Diamond Executive Premier PPO (Household 1003)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1125,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1575
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1004",
    "policyNumber": "POL-2026-1004",
    "planName": "Platinum Comprehensive Shield PPO (Household 1004)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1005",
    "policyNumber": "POL-2026-1005",
    "planName": "Gold Choice Value Managed Care (Household 1005)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1006",
    "policyNumber": "POL-2026-1006",
    "planName": "Silver Select Essential HMO (Household 1006)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1007",
    "policyNumber": "POL-2026-1007",
    "planName": "Diamond Executive Premier PPO (Household 1007)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 750,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1050
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1008",
    "policyNumber": "POL-2026-1008",
    "planName": "Platinum Comprehensive Shield PPO (Household 1008)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1875,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 2625
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1009",
    "policyNumber": "POL-2026-1009",
    "planName": "Gold Choice Value Managed Care (Household 1009)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 3500,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 4900
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1010",
    "policyNumber": "POL-2026-1010",
    "planName": "Silver Select Essential HMO (Household 1010)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1011",
    "policyNumber": "POL-2026-1011",
    "planName": "Diamond Executive Premier PPO (Household 1011)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 375,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 525
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1012",
    "policyNumber": "POL-2026-1012",
    "planName": "Platinum Comprehensive Shield PPO (Household 1012)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1013",
    "policyNumber": "POL-2026-1013",
    "planName": "Gold Choice Value Managed Care (Household 1013)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 2625,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 3675
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1014",
    "policyNumber": "POL-2026-1014",
    "planName": "Silver Select Essential HMO (Household 1014)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 5000,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 7000
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1015",
    "policyNumber": "POL-2026-1015",
    "planName": "Diamond Executive Premier PPO (Household 1015)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1016",
    "policyNumber": "POL-2026-1016",
    "planName": "Platinum Comprehensive Shield PPO (Household 1016)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 625,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 875
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1017",
    "policyNumber": "POL-2026-1017",
    "planName": "Gold Choice Value Managed Care (Household 1017)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 1750,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 2450
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1018",
    "policyNumber": "POL-2026-1018",
    "planName": "Silver Select Essential HMO (Household 1018)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 3750,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 5250
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1019",
    "policyNumber": "POL-2026-1019",
    "planName": "Diamond Executive Premier PPO (Household 1019)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1500,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 2100
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1020",
    "policyNumber": "POL-2026-1020",
    "planName": "Platinum Comprehensive Shield PPO (Household 1020)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1021",
    "policyNumber": "POL-2026-1021",
    "planName": "Gold Choice Value Managed Care (Household 1021)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 875,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 1225
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1022",
    "policyNumber": "POL-2026-1022",
    "planName": "Silver Select Essential HMO (Household 1022)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1023",
    "policyNumber": "POL-2026-1023",
    "planName": "Diamond Executive Premier PPO (Household 1023)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1125,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1575
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1024",
    "policyNumber": "POL-2026-1024",
    "planName": "Platinum Comprehensive Shield PPO (Household 1024)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1025",
    "policyNumber": "POL-2026-1025",
    "planName": "Gold Choice Value Managed Care (Household 1025)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1026",
    "policyNumber": "POL-2026-1026",
    "planName": "Silver Select Essential HMO (Household 1026)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1027",
    "policyNumber": "POL-2026-1027",
    "planName": "Diamond Executive Premier PPO (Household 1027)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 750,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1050
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1028",
    "policyNumber": "POL-2026-1028",
    "planName": "Platinum Comprehensive Shield PPO (Household 1028)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1875,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 2625
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1029",
    "policyNumber": "POL-2026-1029",
    "planName": "Gold Choice Value Managed Care (Household 1029)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 3500,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 4900
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1030",
    "policyNumber": "POL-2026-1030",
    "planName": "Silver Select Essential HMO (Household 1030)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1031",
    "policyNumber": "POL-2026-1031",
    "planName": "Diamond Executive Premier PPO (Household 1031)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 375,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 525
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1032",
    "policyNumber": "POL-2026-1032",
    "planName": "Platinum Comprehensive Shield PPO (Household 1032)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1033",
    "policyNumber": "POL-2026-1033",
    "planName": "Gold Choice Value Managed Care (Household 1033)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 2625,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 3675
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1034",
    "policyNumber": "POL-2026-1034",
    "planName": "Silver Select Essential HMO (Household 1034)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 5000,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 7000
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1035",
    "policyNumber": "POL-2026-1035",
    "planName": "Diamond Executive Premier PPO (Household 1035)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1036",
    "policyNumber": "POL-2026-1036",
    "planName": "Platinum Comprehensive Shield PPO (Household 1036)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 625,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 875
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1037",
    "policyNumber": "POL-2026-1037",
    "planName": "Gold Choice Value Managed Care (Household 1037)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 1750,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 2450
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1038",
    "policyNumber": "POL-2026-1038",
    "planName": "Silver Select Essential HMO (Household 1038)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 3750,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 5250
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1039",
    "policyNumber": "POL-2026-1039",
    "planName": "Diamond Executive Premier PPO (Household 1039)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1500,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 2100
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1040",
    "policyNumber": "POL-2026-1040",
    "planName": "Platinum Comprehensive Shield PPO (Household 1040)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1041",
    "policyNumber": "POL-2026-1041",
    "planName": "Gold Choice Value Managed Care (Household 1041)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 875,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 1225
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1042",
    "policyNumber": "POL-2026-1042",
    "planName": "Silver Select Essential HMO (Household 1042)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1043",
    "policyNumber": "POL-2026-1043",
    "planName": "Diamond Executive Premier PPO (Household 1043)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1125,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1575
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1044",
    "policyNumber": "POL-2026-1044",
    "planName": "Platinum Comprehensive Shield PPO (Household 1044)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1045",
    "policyNumber": "POL-2026-1045",
    "planName": "Gold Choice Value Managed Care (Household 1045)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1046",
    "policyNumber": "POL-2026-1046",
    "planName": "Silver Select Essential HMO (Household 1046)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1047",
    "policyNumber": "POL-2026-1047",
    "planName": "Diamond Executive Premier PPO (Household 1047)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 750,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1050
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1048",
    "policyNumber": "POL-2026-1048",
    "planName": "Platinum Comprehensive Shield PPO (Household 1048)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1875,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 2625
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1049",
    "policyNumber": "POL-2026-1049",
    "planName": "Gold Choice Value Managed Care (Household 1049)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 3500,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 4900
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1050",
    "policyNumber": "POL-2026-1050",
    "planName": "Silver Select Essential HMO (Household 1050)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1051",
    "policyNumber": "POL-2026-1051",
    "planName": "Diamond Executive Premier PPO (Household 1051)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 375,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 525
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1052",
    "policyNumber": "POL-2026-1052",
    "planName": "Platinum Comprehensive Shield PPO (Household 1052)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 1250,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 1750
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1053",
    "policyNumber": "POL-2026-1053",
    "planName": "Gold Choice Value Managed Care (Household 1053)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 2625,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 3675
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1054",
    "policyNumber": "POL-2026-1054",
    "planName": "Silver Select Essential HMO (Household 1054)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 5000,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 7000
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1055",
    "policyNumber": "POL-2026-1055",
    "planName": "Diamond Executive Premier PPO (Household 1055)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1056",
    "policyNumber": "POL-2026-1056",
    "planName": "Platinum Comprehensive Shield PPO (Household 1056)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 625,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 875
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1057",
    "policyNumber": "POL-2026-1057",
    "planName": "Gold Choice Value Managed Care (Household 1057)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 1750,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 2450
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1058",
    "policyNumber": "POL-2026-1058",
    "planName": "Silver Select Essential HMO (Household 1058)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 3750,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 5250
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1059",
    "policyNumber": "POL-2026-1059",
    "planName": "Diamond Executive Premier PPO (Household 1059)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1500,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 2100
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1060",
    "policyNumber": "POL-2026-1060",
    "planName": "Platinum Comprehensive Shield PPO (Household 1060)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1061",
    "policyNumber": "POL-2026-1061",
    "planName": "Gold Choice Value Managed Care (Household 1061)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 875,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 1225
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1062",
    "policyNumber": "POL-2026-1062",
    "planName": "Silver Select Essential HMO (Household 1062)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 5000,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 9000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 50,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 30,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 40,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1063",
    "policyNumber": "POL-2026-1063",
    "planName": "Diamond Executive Premier PPO (Household 1063)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "OUT_OF_NETWORK",
    "financials": {
      "familyDeductible": 1500,
      "familyDeductibleMet": 1125,
      "outOfPocketMax": 4500,
      "outOfPocketMet": 1575
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 20,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 15,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 5,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1064",
    "policyNumber": "POL-2026-1064",
    "planName": "Platinum Comprehensive Shield PPO (Household 1064)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 2500,
      "familyDeductibleMet": 2500,
      "outOfPocketMax": 6000,
      "outOfPocketMet": 3500
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 30,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 20,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 25,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 10,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  },
  {
    "_id": "pol-1065",
    "policyNumber": "POL-2026-1065",
    "planName": "Gold Choice Value Managed Care (Household 1065)",
    "status": "ACTIVE",
    "effectiveDate": "2026-01-01T00:00:00Z",
    "expirationDate": "2026-12-31T23:59:59Z",
    "networkType": "IN_NETWORK",
    "financials": {
      "familyDeductible": 3500,
      "familyDeductibleMet": 0,
      "outOfPocketMax": 7500,
      "outOfPocketMet": 0
    },
    "coverages": [
      {
        "category": "MEDICAL",
        "copay": 40,
        "coinsurancePct": 0.2,
        "maxBenefit": 500000,
        "accumulatedPaid": 12000
      },
      {
        "category": "PHARMACY",
        "copay": 25,
        "coinsurancePct": 0.15,
        "maxBenefit": 25000,
        "accumulatedPaid": 1500
      },
      {
        "category": "BEHAVIORAL_HEALTH",
        "copay": 30,
        "coinsurancePct": 0.1,
        "maxBenefit": 100000,
        "accumulatedPaid": 3200
      },
      {
        "category": "PRESCRIPTION",
        "copay": 15,
        "coinsurancePct": 0.15,
        "maxBenefit": 50000,
        "accumulatedPaid": 2100
      }
    ],
    "exclusions": [
      "COSMETIC_SURGERY",
      "EXPERIMENTAL_THERAPY"
    ],
    "requiresPreAuthCodes": [
      "CPT-29881",
      "CPT-70553"
    ]
  }
];
export const EXTENDED_CLAIMS: Claim[] = [
  {
    "_id": "claim-1001",
    "claimId": "CLM-2026-1001",
    "caseId": "case-1001",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1001-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 40,
        "coinsurance": 48,
        "eligiblePayout": 192,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1001"
  },
  {
    "_id": "claim-1002",
    "claimId": "CLM-2026-1002",
    "caseId": "case-1002",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1002-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 50,
        "coinsurance": 74,
        "eligiblePayout": 296,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1002"
  },
  {
    "_id": "claim-1003",
    "claimId": "CLM-2026-1003",
    "caseId": "case-1003",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1003-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 20,
        "coinsurance": 356,
        "eligiblePayout": 1424,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1003"
  },
  {
    "_id": "claim-1004",
    "claimId": "CLM-2026-1004",
    "caseId": "case-1004",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1004-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 30,
        "coinsurance": 264,
        "eligiblePayout": 1056,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1004"
  },
  {
    "_id": "claim-1005",
    "claimId": "CLM-2026-1005",
    "caseId": "case-1005",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1005-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 40,
        "coinsurance": 712,
        "eligiblePayout": 2848,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1005"
  },
  {
    "_id": "claim-1006",
    "claimId": "CLM-2026-1006",
    "caseId": "case-1006",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1006-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-01-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 50,
        "coinsurance": 28,
        "eligiblePayout": 112,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1006"
  },
  {
    "_id": "claim-1007",
    "claimId": "CLM-2026-1007",
    "caseId": "case-1007",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1007-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 20,
        "coinsurance": 246,
        "eligiblePayout": 984,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1007"
  },
  {
    "_id": "claim-1008",
    "claimId": "CLM-2026-1008",
    "caseId": "case-1008",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1008-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-03-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 30,
        "coinsurance": 190,
        "eligiblePayout": 760,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1008"
  },
  {
    "_id": "claim-1009",
    "claimId": "CLM-2026-1009",
    "caseId": "case-1009",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1009-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-01-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 40,
        "coinsurance": 96,
        "eligiblePayout": 384,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1009"
  },
  {
    "_id": "claim-1010",
    "claimId": "CLM-2026-1010",
    "caseId": "case-1010",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1010-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 50,
        "coinsurance": 22,
        "eligiblePayout": 88,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1010"
  },
  {
    "_id": "claim-1011",
    "claimId": "CLM-2026-1011",
    "caseId": "case-1011",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1011-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 20,
        "coinsurance": 52,
        "eligiblePayout": 208,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1011"
  },
  {
    "_id": "claim-1012",
    "claimId": "CLM-2026-1012",
    "caseId": "case-1012",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1012-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 30,
        "coinsurance": 78,
        "eligiblePayout": 312,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1012"
  },
  {
    "_id": "claim-1013",
    "claimId": "CLM-2026-1013",
    "caseId": "case-1013",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1013-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 40,
        "coinsurance": 352,
        "eligiblePayout": 1408,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1013"
  },
  {
    "_id": "claim-1014",
    "claimId": "CLM-2026-1014",
    "caseId": "case-1014",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1014-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 50,
        "coinsurance": 260,
        "eligiblePayout": 1040,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1014"
  },
  {
    "_id": "claim-1015",
    "claimId": "CLM-2026-1015",
    "caseId": "case-1015",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1015-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 20,
        "coinsurance": 716,
        "eligiblePayout": 2864,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1015"
  },
  {
    "_id": "claim-1016",
    "claimId": "CLM-2026-1016",
    "caseId": "case-1016",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1016-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-02-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 30,
        "coinsurance": 32,
        "eligiblePayout": 128,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1016"
  },
  {
    "_id": "claim-1017",
    "claimId": "CLM-2026-1017",
    "caseId": "case-1017",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1017-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 40,
        "coinsurance": 242,
        "eligiblePayout": 968,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1017"
  },
  {
    "_id": "claim-1018",
    "claimId": "CLM-2026-1018",
    "caseId": "case-1018",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1018-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-01-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 50,
        "coinsurance": 186,
        "eligiblePayout": 744,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1018"
  },
  {
    "_id": "claim-1019",
    "claimId": "CLM-2026-1019",
    "caseId": "case-1019",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1019-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-02-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 20,
        "coinsurance": 100,
        "eligiblePayout": 400,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1019"
  },
  {
    "_id": "claim-1020",
    "claimId": "CLM-2026-1020",
    "caseId": "case-1020",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1020-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 30,
        "coinsurance": 26,
        "eligiblePayout": 104,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1020"
  },
  {
    "_id": "claim-1021",
    "claimId": "CLM-2026-1021",
    "caseId": "case-1021",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1021-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 40,
        "coinsurance": 48,
        "eligiblePayout": 192,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1021"
  },
  {
    "_id": "claim-1022",
    "claimId": "CLM-2026-1022",
    "caseId": "case-1022",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1022-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 50,
        "coinsurance": 74,
        "eligiblePayout": 296,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1022"
  },
  {
    "_id": "claim-1023",
    "claimId": "CLM-2026-1023",
    "caseId": "case-1023",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1023-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 20,
        "coinsurance": 356,
        "eligiblePayout": 1424,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1023"
  },
  {
    "_id": "claim-1024",
    "claimId": "CLM-2026-1024",
    "caseId": "case-1024",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1024-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 30,
        "coinsurance": 264,
        "eligiblePayout": 1056,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1024"
  },
  {
    "_id": "claim-1025",
    "claimId": "CLM-2026-1025",
    "caseId": "case-1025",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1025-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 40,
        "coinsurance": 712,
        "eligiblePayout": 2848,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1025"
  },
  {
    "_id": "claim-1026",
    "claimId": "CLM-2026-1026",
    "caseId": "case-1026",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1026-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-03-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 50,
        "coinsurance": 28,
        "eligiblePayout": 112,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1026"
  },
  {
    "_id": "claim-1027",
    "claimId": "CLM-2026-1027",
    "caseId": "case-1027",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1027-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 20,
        "coinsurance": 246,
        "eligiblePayout": 984,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1027"
  },
  {
    "_id": "claim-1028",
    "claimId": "CLM-2026-1028",
    "caseId": "case-1028",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1028-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-02-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 30,
        "coinsurance": 190,
        "eligiblePayout": 760,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1028"
  },
  {
    "_id": "claim-1029",
    "claimId": "CLM-2026-1029",
    "caseId": "case-1029",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1029-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-03-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 40,
        "coinsurance": 96,
        "eligiblePayout": 384,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1029"
  },
  {
    "_id": "claim-1030",
    "claimId": "CLM-2026-1030",
    "caseId": "case-1030",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1030-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 50,
        "coinsurance": 22,
        "eligiblePayout": 88,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1030"
  },
  {
    "_id": "claim-1031",
    "claimId": "CLM-2026-1031",
    "caseId": "case-1031",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1031-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 20,
        "coinsurance": 52,
        "eligiblePayout": 208,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1031"
  },
  {
    "_id": "claim-1032",
    "claimId": "CLM-2026-1032",
    "caseId": "case-1032",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1032-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 30,
        "coinsurance": 78,
        "eligiblePayout": 312,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1032"
  },
  {
    "_id": "claim-1033",
    "claimId": "CLM-2026-1033",
    "caseId": "case-1033",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1033-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 40,
        "coinsurance": 352,
        "eligiblePayout": 1408,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1033"
  },
  {
    "_id": "claim-1034",
    "claimId": "CLM-2026-1034",
    "caseId": "case-1034",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1034-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 50,
        "coinsurance": 260,
        "eligiblePayout": 1040,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1034"
  },
  {
    "_id": "claim-1035",
    "claimId": "CLM-2026-1035",
    "caseId": "case-1035",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1035-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 20,
        "coinsurance": 716,
        "eligiblePayout": 2864,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1035"
  },
  {
    "_id": "claim-1036",
    "claimId": "CLM-2026-1036",
    "caseId": "case-1036",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1036-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-01-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 30,
        "coinsurance": 32,
        "eligiblePayout": 128,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1036"
  },
  {
    "_id": "claim-1037",
    "claimId": "CLM-2026-1037",
    "caseId": "case-1037",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1037-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 40,
        "coinsurance": 242,
        "eligiblePayout": 968,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1037"
  },
  {
    "_id": "claim-1038",
    "claimId": "CLM-2026-1038",
    "caseId": "case-1038",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1038-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-03-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 50,
        "coinsurance": 186,
        "eligiblePayout": 744,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1038"
  },
  {
    "_id": "claim-1039",
    "claimId": "CLM-2026-1039",
    "caseId": "case-1039",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1039-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-01-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 20,
        "coinsurance": 100,
        "eligiblePayout": 400,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1039"
  },
  {
    "_id": "claim-1040",
    "claimId": "CLM-2026-1040",
    "caseId": "case-1040",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1040-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 30,
        "coinsurance": 26,
        "eligiblePayout": 104,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1040"
  },
  {
    "_id": "claim-1041",
    "claimId": "CLM-2026-1041",
    "caseId": "case-1041",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1041-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 40,
        "coinsurance": 48,
        "eligiblePayout": 192,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1041"
  },
  {
    "_id": "claim-1042",
    "claimId": "CLM-2026-1042",
    "caseId": "case-1042",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1042-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 50,
        "coinsurance": 74,
        "eligiblePayout": 296,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1042"
  },
  {
    "_id": "claim-1043",
    "claimId": "CLM-2026-1043",
    "caseId": "case-1043",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1043-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 20,
        "coinsurance": 356,
        "eligiblePayout": 1424,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1043"
  },
  {
    "_id": "claim-1044",
    "claimId": "CLM-2026-1044",
    "caseId": "case-1044",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1044-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 30,
        "coinsurance": 264,
        "eligiblePayout": 1056,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1044"
  },
  {
    "_id": "claim-1045",
    "claimId": "CLM-2026-1045",
    "caseId": "case-1045",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1045-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 40,
        "coinsurance": 712,
        "eligiblePayout": 2848,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1045"
  },
  {
    "_id": "claim-1046",
    "claimId": "CLM-2026-1046",
    "caseId": "case-1046",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1046-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-02-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 50,
        "coinsurance": 28,
        "eligiblePayout": 112,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1046"
  },
  {
    "_id": "claim-1047",
    "claimId": "CLM-2026-1047",
    "caseId": "case-1047",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1047-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 20,
        "coinsurance": 246,
        "eligiblePayout": 984,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1047"
  },
  {
    "_id": "claim-1048",
    "claimId": "CLM-2026-1048",
    "caseId": "case-1048",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1048-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-01-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 30,
        "coinsurance": 190,
        "eligiblePayout": 760,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1048"
  },
  {
    "_id": "claim-1049",
    "claimId": "CLM-2026-1049",
    "caseId": "case-1049",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1049-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-02-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 40,
        "coinsurance": 96,
        "eligiblePayout": 384,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1049"
  },
  {
    "_id": "claim-1050",
    "claimId": "CLM-2026-1050",
    "caseId": "case-1050",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1050-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 50,
        "coinsurance": 22,
        "eligiblePayout": 88,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1050"
  },
  {
    "_id": "claim-1051",
    "claimId": "CLM-2026-1051",
    "caseId": "case-1051",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1051-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 20,
        "coinsurance": 52,
        "eligiblePayout": 208,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1051"
  },
  {
    "_id": "claim-1052",
    "claimId": "CLM-2026-1052",
    "caseId": "case-1052",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1052-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 30,
        "coinsurance": 78,
        "eligiblePayout": 312,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1052"
  },
  {
    "_id": "claim-1053",
    "claimId": "CLM-2026-1053",
    "caseId": "case-1053",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1053-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 40,
        "coinsurance": 352,
        "eligiblePayout": 1408,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1053"
  },
  {
    "_id": "claim-1054",
    "claimId": "CLM-2026-1054",
    "caseId": "case-1054",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1054-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 50,
        "coinsurance": 260,
        "eligiblePayout": 1040,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1054"
  },
  {
    "_id": "claim-1055",
    "claimId": "CLM-2026-1055",
    "caseId": "case-1055",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1055-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 20,
        "coinsurance": 716,
        "eligiblePayout": 2864,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1055"
  },
  {
    "_id": "claim-1056",
    "claimId": "CLM-2026-1056",
    "caseId": "case-1056",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 240,
    "items": [
      {
        "itemId": "ITM-1056-1",
        "code": "CPT-90834",
        "description": "Psychotherapy, 45 minutes with patient",
        "category": "BEHAVIORAL_HEALTH",
        "startDate": "2026-03-15",
        "billedAmount": 240,
        "allowableAmount": 190,
        "copay": 30,
        "coinsurance": 32,
        "eligiblePayout": 128,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1056"
  },
  {
    "_id": "claim-1057",
    "claimId": "CLM-2026-1057",
    "caseId": "case-1057",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 1750,
    "items": [
      {
        "itemId": "ITM-1057-1",
        "code": "CPT-73721",
        "description": "MRI lower extremity joint without contrast",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 1750,
        "allowableAmount": 1250,
        "copay": 40,
        "coinsurance": 242,
        "eligiblePayout": 968,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1057"
  },
  {
    "_id": "claim-1058",
    "claimId": "CLM-2026-1058",
    "caseId": "case-1058",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1200,
    "items": [
      {
        "itemId": "ITM-1058-1",
        "code": "NDC-9021",
        "description": "Specialty Immunotherapy maintenance dose",
        "category": "PRESCRIPTION",
        "startDate": "2026-02-15",
        "billedAmount": 1200,
        "allowableAmount": 980,
        "copay": 50,
        "coinsurance": 186,
        "eligiblePayout": 744,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1058"
  },
  {
    "_id": "claim-1059",
    "claimId": "CLM-2026-1059",
    "caseId": "case-1059",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 650,
    "items": [
      {
        "itemId": "ITM-1059-1",
        "code": "NDC-4001",
        "description": "Maintenance prescription specialty injection",
        "category": "PHARMACY",
        "startDate": "2026-03-15",
        "billedAmount": 650,
        "allowableAmount": 520,
        "copay": 20,
        "coinsurance": 100,
        "eligiblePayout": 400,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1059"
  },
  {
    "_id": "claim-1060",
    "claimId": "CLM-2026-1060",
    "caseId": "case-1060",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 220,
    "items": [
      {
        "itemId": "ITM-1060-1",
        "code": "CPT-99213",
        "description": "Office/outpatient visit, low complexity, 20-29 mins",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 220,
        "allowableAmount": 160,
        "copay": 30,
        "coinsurance": 26,
        "eligiblePayout": 104,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1060"
  },
  {
    "_id": "claim-1061",
    "claimId": "CLM-2026-1061",
    "caseId": "case-1061",
    "provider": {
      "npi": "1492019482",
      "name": "Advanced Diagnostic Imaging Institute",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "450 West Roosevelt Rd, Chicago, IL"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 380,
    "items": [
      {
        "itemId": "ITM-1061-1",
        "code": "CPT-99214",
        "description": "Office/outpatient visit, moderate complexity, 30-39 mins",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 380,
        "allowableAmount": 280,
        "copay": 40,
        "coinsurance": 48,
        "eligiblePayout": 192,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1061"
  },
  {
    "_id": "claim-1062",
    "claimId": "CLM-2026-1062",
    "caseId": "case-1062",
    "provider": {
      "npi": "1837492019",
      "name": "Island Neuropsychology & Behavioral Health",
      "facilityType": "PHYSICIAN_GROUP",
      "address": "1088 Bishop St Suite 400, Honolulu, HI"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 560,
    "items": [
      {
        "itemId": "ITM-1062-1",
        "code": "CPT-99215",
        "description": "Office/outpatient visit, high complexity, 40-54 mins",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 560,
        "allowableAmount": 420,
        "copay": 50,
        "coinsurance": 74,
        "eligiblePayout": 296,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1062"
  },
  {
    "_id": "claim-1063",
    "claimId": "CLM-2026-1063",
    "caseId": "case-1063",
    "provider": {
      "npi": "1728394012",
      "name": "Horizon Community Health & Wellness",
      "facilityType": "INSTITUTIONAL",
      "address": "1200 University Ave, Austin, TX"
    },
    "serviceDate": "2026-01-15T09:30:00Z",
    "totalBilledAmount": 2400,
    "items": [
      {
        "itemId": "ITM-1063-1",
        "code": "CPT-70553",
        "description": "MRI brain without & with contrast material",
        "category": "MEDICAL",
        "startDate": "2026-01-15",
        "billedAmount": 2400,
        "allowableAmount": 1800,
        "copay": 20,
        "coinsurance": 356,
        "eligiblePayout": 1424,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1063"
  },
  {
    "_id": "claim-1064",
    "claimId": "CLM-2026-1064",
    "caseId": "case-1064",
    "provider": {
      "npi": "1638291045",
      "name": "Pacific Northwest Specialty Care",
      "facilityType": "SPECIALTY_CLINIC",
      "address": "800 5th Ave, Seattle, WA"
    },
    "serviceDate": "2026-02-15T09:30:00Z",
    "totalBilledAmount": 1850,
    "items": [
      {
        "itemId": "ITM-1064-1",
        "code": "CPT-71260",
        "description": "CT thorax diagnostic with contrast",
        "category": "MEDICAL",
        "startDate": "2026-02-15",
        "billedAmount": 1850,
        "allowableAmount": 1350,
        "copay": 30,
        "coinsurance": 264,
        "eligiblePayout": 1056,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1064"
  },
  {
    "_id": "claim-1065",
    "claimId": "CLM-2026-1065",
    "caseId": "case-1065",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Surgical & Medical Center",
      "facilityType": "INSTITUTIONAL",
      "address": "742 Evergreen Terrace, Springfield, IL"
    },
    "serviceDate": "2026-03-15T09:30:00Z",
    "totalBilledAmount": 4800,
    "items": [
      {
        "itemId": "ITM-1065-1",
        "code": "CPT-29881",
        "description": "Arthroscopy, knee, surgical; with meniscectomy",
        "category": "MEDICAL",
        "startDate": "2026-03-15",
        "billedAmount": 4800,
        "allowableAmount": 3600,
        "copay": 40,
        "coinsurance": 712,
        "eligiblePayout": 2848,
        "clinicalDecision": "PENDING"
      }
    ],
    "preAuthNumber": "PA-2026-1065"
  }
];
