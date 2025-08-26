"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import {
  CreateCareHomeData,
  useAdminActions,
  CareType,
  Specialization,
  Facility,
} from "@/actions-client/admin";
import styles from "./add-care-home.module.scss";

interface CareHomeFormData {
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  isActive: boolean;
  specializations: string[];
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  contactInfo: {
    emergency: string;
    manager: string;
  };
  careTypeId: number;
  facilityIds: string[];
  imageUrls: string[];
}

const initialFormData: CareHomeFormData = {
  name: "",
  description: [],
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postcode: "",
  country: "England",
  countryCode: "GB-ENG",
  latitude: 0,
  longitude: 0,
  phone: "",
  email: "",
  website: "",
  weeklyPrice: undefined,
  monthlyPrice: undefined,
  totalBeds: undefined,
  availableBeds: undefined,
  isActive: true,
  specializations: [],
  openingHours: {
    Monday: "9:00 AM - 5:00 PM",
    Tuesday: "9:00 AM - 5:00 PM",
    Wednesday: "9:00 AM - 5:00 PM",
    Thursday: "9:00 AM - 5:00 PM",
    Friday: "9:00 AM - 5:00 PM",
    Saturday: "9:00 AM - 5:00 PM",
    Sunday: "9:00 AM - 5:00 PM",
  },
  contactInfo: {
    emergency: "",
    manager: "",
  },
  careTypeId: 0,
  facilityIds: [],
  imageUrls: [],
};

// Configuration data will be loaded from API

// UK Countries and their regions/states
const ukCountries = [
  { code: "GB-ENG", name: "England" },
  { code: "GB-SCT", name: "Scotland" },
  { code: "GB-WLS", name: "Wales" },
  { code: "GB-NIR", name: "Northern Ireland" },
];

const ukRegions = {
  "GB-ENG": [
    "Bedfordshire",
    "Berkshire",
    "Bristol",
    "Buckinghamshire",
    "Cambridgeshire",
    "Cheshire",
    "City of London",
    "Cornwall",
    "Cumbria",
    "Derbyshire",
    "Devon",
    "Dorset",
    "Durham",
    "East Riding of Yorkshire",
    "East Sussex",
    "Essex",
    "Gloucestershire",
    "Greater London",
    "Greater Manchester",
    "Hampshire",
    "Herefordshire",
    "Hertfordshire",
    "Isle of Wight",
    "Kent",
    "Lancashire",
    "Leicestershire",
    "Lincolnshire",
    "London",
    "Merseyside",
    "Norfolk",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottinghamshire",
    "Oxfordshire",
    "Rutland",
    "Shropshire",
    "Somerset",
    "South Yorkshire",
    "Staffordshire",
    "Suffolk",
    "Surrey",
    "Tyne and Wear",
    "Warwickshire",
    "West Midlands",
    "West Sussex",
    "West Yorkshire",
    "Wiltshire",
    "Worcestershire",
  ],
  "GB-SCT": [
    "Aberdeen City",
    "Aberdeenshire",
    "Angus",
    "Argyll and Bute",
    "City of Edinburgh",
    "Clackmannanshire",
    "Dumfries and Galloway",
    "Dundee City",
    "East Ayrshire",
    "East Dunbartonshire",
    "East Lothian",
    "East Renfrewshire",
    "Falkirk",
    "Fife",
    "Glasgow City",
    "Highland",
    "Inverclyde",
    "Midlothian",
    "Moray",
    "Na h-Eileanan Siar",
    "North Ayrshire",
    "North Lanarkshire",
    "Orkney Islands",
    "Perth and Kinross",
    "Renfrewshire",
    "Scottish Borders",
    "Shetland Islands",
    "South Ayrshire",
    "South Lanarkshire",
    "Stirling",
    "West Dunbartonshire",
    "West Lothian",
  ],
  "GB-WLS": [
    "Blaenau Gwent",
    "Bridgend",
    "Caerphilly",
    "Cardiff",
    "Carmarthenshire",
    "Ceredigion",
    "Conwy",
    "Denbighshire",
    "Flintshire",
    "Gwynedd",
    "Isle of Anglesey",
    "Merthyr Tydfil",
    "Monmouthshire",
    "Neath Port Talbot",
    "Newport",
    "Pembrokeshire",
    "Powys",
    "Rhondda Cynon Taf",
    "Swansea",
    "Torfaen",
    "Vale of Glamorgan",
    "Wrexham",
  ],
  "GB-NIR": [
    "Antrim and Newtownabbey",
    "Ards and North Down",
    "Armagh City, Banbridge and Craigavon",
    "Belfast",
    "Causeway Coast and Glens",
    "Derry City and Strabane",
    "Fermanagh and Omagh",
    "Lisburn and Castlereagh",
    "Mid and East Antrim",
    "Mid Ulster",
    "Newry, Mourne and Down",
  ],
};

// Cities for each region in the UK
const ukCities = {
  "GB-ENG": {
    "Greater London": [
      "London",
      "Westminster",
      "Camden",
      "Islington",
      "Hackney",
      "Tower Hamlets",
      "Greenwich",
      "Lewisham",
      "Southwark",
      "Lambeth",
      "Wandsworth",
      "Hammersmith and Fulham",
      "Kensington and Chelsea",
      "Westminster",
      "Brent",
      "Ealing",
      "Hounslow",
      "Richmond upon Thames",
      "Kingston upon Thames",
      "Merton",
      "Sutton",
      "Croydon",
      "Bromley",
      "Bexley",
      "Havering",
      "Barking and Dagenham",
      "Redbridge",
      "Newham",
      "Waltham Forest",
      "Haringey",
      "Enfield",
      "Barnet",
      "Harrow",
      "Hillingdon",
    ],
    "Greater Manchester": [
      "Manchester",
      "Bolton",
      "Bury",
      "Oldham",
      "Rochdale",
      "Stockport",
      "Tameside",
      "Trafford",
      "Wigan",
      "Salford",
    ],
    "West Midlands": [
      "Birmingham",
      "Coventry",
      "Dudley",
      "Sandwell",
      "Solihull",
      "Walsall",
      "Wolverhampton",
    ],
    Merseyside: ["Liverpool", "Knowsley", "St Helens", "Sefton", "Wirral"],
    "South Yorkshire": ["Sheffield", "Barnsley", "Doncaster", "Rotherham"],
    "West Yorkshire": [
      "Leeds",
      "Bradford",
      "Calderdale",
      "Kirklees",
      "Wakefield",
    ],
    "Tyne and Wear": [
      "Newcastle upon Tyne",
      "Gateshead",
      "North Tyneside",
      "South Tyneside",
      "Sunderland",
    ],
    Bristol: ["Bristol"],
    Leicestershire: [
      "Leicester",
      "Loughborough",
      "Melton Mowbray",
      "Market Harborough",
    ],
    Nottinghamshire: ["Nottingham", "Mansfield", "Newark", "Worksop"],
    Derbyshire: ["Derby", "Chesterfield", "Buxton", "Matlock"],
    Lancashire: ["Lancaster", "Blackpool", "Preston", "Blackburn", "Burnley"],
    Kent: [
      "Canterbury",
      "Dover",
      "Maidstone",
      "Rochester",
      "Chatham",
      "Gillingham",
    ],
    Essex: [
      "Chelmsford",
      "Colchester",
      "Southend-on-Sea",
      "Basildon",
      "Braintree",
    ],
    Hampshire: [
      "Southampton",
      "Portsmouth",
      "Winchester",
      "Basingstoke",
      "Aldershot",
    ],
    Surrey: ["Guildford", "Woking", "Epsom", "Reigate", "Dorking"],
    Berkshire: ["Reading", "Slough", "Bracknell", "Windsor", "Maidenhead"],
    Buckinghamshire: ["Aylesbury", "High Wycombe", "Milton Keynes", "Amersham"],
    Oxfordshire: ["Oxford", "Banbury", "Witney", "Abingdon"],
    Gloucestershire: ["Gloucester", "Cheltenham", "Stroud", "Cirencester"],
    Somerset: ["Taunton", "Bath", "Wells", "Yeovil", "Bridgwater"],
    Devon: ["Exeter", "Plymouth", "Torquay", "Paignton", "Barnstaple"],
    Cornwall: ["Truro", "Penzance", "St Austell", "Falmouth", "Newquay"],
    Dorset: ["Dorchester", "Bournemouth", "Poole", "Weymouth", "Shaftesbury"],
    Wiltshire: ["Salisbury", "Swindon", "Trowbridge", "Chippenham"],
    Hertfordshire: [
      "St Albans",
      "Watford",
      "Hemel Hempstead",
      "Stevenage",
      "Welwyn Garden City",
    ],
    Bedfordshire: ["Bedford", "Luton", "Dunstable", "Leighton Buzzard"],
    Cambridgeshire: [
      "Cambridge",
      "Peterborough",
      "Ely",
      "Wisbech",
      "Huntingdon",
    ],
    Norfolk: [
      "Norwich",
      "Great Yarmouth",
      "King's Lynn",
      "Thetford",
      "Dereham",
    ],
    Suffolk: [
      "Ipswich",
      "Bury St Edmunds",
      "Lowestoft",
      "Felixstowe",
      "Newmarket",
    ],
    Lincolnshire: ["Lincoln", "Grimsby", "Scunthorpe", "Boston", "Grantham"],
    Staffordshire: [
      "Stafford",
      "Stoke-on-Trent",
      "Burton upon Trent",
      "Lichfield",
      "Tamworth",
    ],
    Warwickshire: [
      "Warwick",
      "Coventry",
      "Leamington Spa",
      "Nuneaton",
      "Rugby",
    ],
    Northamptonshire: [
      "Northampton",
      "Kettering",
      "Wellingborough",
      "Corby",
      "Daventry",
    ],
    Rutland: ["Oakham", "Uppingham"],
    Shropshire: ["Shrewsbury", "Telford", "Oswestry", "Bridgnorth", "Ludlow"],
    Herefordshire: ["Hereford", "Leominster", "Ross-on-Wye", "Ledbury"],
    Worcestershire: [
      "Worcester",
      "Kidderminster",
      "Redditch",
      "Bromsgrove",
      "Malvern",
    ],
    Cheshire: ["Chester", "Warrington", "Crewe", "Macclesfield", "Widnes"],
    Cumbria: [
      "Carlisle",
      "Barrow-in-Furness",
      "Kendal",
      "Whitehaven",
      "Workington",
    ],
    Northumberland: [
      "Newcastle upon Tyne",
      "Morpeth",
      "Berwick-upon-Tweed",
      "Hexham",
      "Alnwick",
    ],
    Durham: [
      "Durham",
      "Darlington",
      "Hartlepool",
      "Stockton-on-Tees",
      "Middlesbrough",
    ],
    "North Yorkshire": [
      "York",
      "Harrogate",
      "Scarborough",
      "Whitby",
      "Middlesbrough",
    ],
    "East Riding of Yorkshire": [
      "Hull",
      "Beverley",
      "Bridlington",
      "Goole",
      "Driffield",
    ],
    "East Sussex": ["Lewes", "Brighton", "Eastbourne", "Hastings", "Bexhill"],
    "West Sussex": [
      "Chichester",
      "Worthing",
      "Crawley",
      "Horsham",
      "Bognor Regis",
    ],
    "Isle of Wight": ["Newport", "Ryde", "Cowes", "Ventnor", "Sandown"],
    "City of London": ["London"],
    London: ["London"],
  },
  "GB-SCT": {
    "Glasgow City": ["Glasgow", "Govan", "Partick", "Maryhill", "Pollokshaws"],
    "City of Edinburgh": ["Edinburgh", "Leith", "Portobello", "Musselburgh"],
    "Aberdeen City": ["Aberdeen", "Bridge of Don", "Dyce", "Cove Bay"],
    "Dundee City": ["Dundee", "Broughty Ferry", "Monifieth", "Carnoustie"],
    Fife: ["St Andrews", "Dunfermline", "Kirkcaldy", "Glenrothes", "Cupar"],
    Highland: ["Inverness", "Fort William", "Thurso", "Wick", "Aviemore"],
    Aberdeenshire: [
      "Aberdeen",
      "Peterhead",
      "Fraserburgh",
      "Stonehaven",
      "Banchory",
    ],
    "Perth and Kinross": [
      "Perth",
      "Blairgowrie",
      "Crieff",
      "Pitlochry",
      "Kinross",
    ],
    Angus: ["Forfar", "Arbroath", "Montrose", "Brechin", "Carnoustie"],
    "Dumfries and Galloway": [
      "Dumfries",
      "Stranraer",
      "Annan",
      "Lockerbie",
      "Castle Douglas",
    ],
    "Scottish Borders": [
      "Galashiels",
      "Hawick",
      "Selkirk",
      "Peebles",
      "Jedburgh",
    ],
    "West Lothian": [
      "Livingston",
      "Bathgate",
      "Linlithgow",
      "Broxburn",
      "Armadale",
    ],
    "East Lothian": [
      "Haddington",
      "Musselburgh",
      "North Berwick",
      "Dunbar",
      "Tranent",
    ],
    Midlothian: ["Dalkeith", "Penicuik", "Bonnyrigg", "Loanhead", "Gorebridge"],
    "South Lanarkshire": [
      "Hamilton",
      "East Kilbride",
      "Lanark",
      "Carluke",
      "Biggar",
    ],
    "North Lanarkshire": [
      "Motherwell",
      "Coatbridge",
      "Airdrie",
      "Cumbernauld",
      "Wishaw",
    ],
    Renfrewshire: ["Paisley", "Johnstone", "Renfrew", "Barrhead", "Erskine"],
    "East Renfrewshire": [
      "Giffnock",
      "Newton Mearns",
      "Barrhead",
      "Clarkston",
      "Thornliebank",
    ],
    "West Dunbartonshire": [
      "Dumbarton",
      "Clydebank",
      "Balloch",
      "Alexandria",
      "Helensburgh",
    ],
    "East Dunbartonshire": [
      "Kirkintilloch",
      "Bearsden",
      "Milngavie",
      "Bishopbriggs",
      "Lenzie",
    ],
    Stirling: ["Stirling", "Bridge of Allan", "Dunblane", "Callander", "Doune"],
    Falkirk: ["Falkirk", "Grangemouth", "Bo'ness", "Larbert", "Denny"],
    Clackmannanshire: ["Alloa", "Tullibody", "Tillicoultry", "Dollar", "Alva"],
    "Argyll and Bute": [
      "Oban",
      "Helensburgh",
      "Campbeltown",
      "Dunoon",
      "Lochgilphead",
    ],
    Inverclyde: [
      "Greenock",
      "Port Glasgow",
      "Gourock",
      "Wemyss Bay",
      "Kilmacolm",
    ],
    "South Ayrshire": ["Ayr", "Prestwick", "Troon", "Girvan", "Maybole"],
    "North Ayrshire": [
      "Irvine",
      "Kilwinning",
      "Ardrossan",
      "Saltcoats",
      "Largs",
    ],
    "East Ayrshire": [
      "Kilmarnock",
      "Cumnock",
      "Doon Valley",
      "Stewarton",
      "Darvel",
    ],
    Moray: ["Elgin", "Forres", "Lossiemouth", "Buckie", "Keith"],
    "Na h-Eileanan Siar": [
      "Stornoway",
      "Tarbert",
      "Lochmaddy",
      "Balivanich",
      "Castlebay",
    ],
    "Orkney Islands": ["Kirkwall", "Stromness", "Dounby", "Finstown", "Birsay"],
    "Shetland Islands": ["Lerwick", "Scalloway", "Brae", "Aith", "Sandwick"],
  },
  "GB-WLS": {
    Cardiff: ["Cardiff", "Penarth", "Dinas Powys", "Llandaff", "Radyr"],
    Swansea: ["Swansea", "Mumbles", "Gorseinon", "Pontarddulais", "Llanelli"],
    Newport: ["Newport", "Cwmbran", "Pontypool", "Abergavenny", "Chepstow"],
    Wrexham: ["Wrexham", "Rhyl", "Colwyn Bay", "Llandudno", "Bangor"],
    "Rhondda Cynon Taf": [
      "Pontypridd",
      "Aberdare",
      "Mountain Ash",
      "Porth",
      "Tonypandy",
    ],
    Bridgend: ["Bridgend", "Maesteg", "Porthcawl", "Pencoed", "Llantwit Major"],
    "Vale of Glamorgan": [
      "Barry",
      "Cowbridge",
      "Penarth",
      "Llantwit Major",
      "Dinas Powys",
    ],
    Caerphilly: [
      "Caerphilly",
      "Blackwood",
      "Bargoed",
      "Ystrad Mynach",
      "Risca",
    ],
    "Merthyr Tydfil": [
      "Merthyr Tydfil",
      "Aberfan",
      "Troedyrhiw",
      "Bedlinog",
      "Treharris",
    ],
    "Blaenau Gwent": [
      "Ebbw Vale",
      "Abertillery",
      "Tredegar",
      "Brynmawr",
      "Nantyglo",
    ],
    Torfaen: ["Pontypool", "Cwmbran", "Abersychan", "Blaenavon", "Trevethin"],
    Monmouthshire: ["Abergavenny", "Monmouth", "Caldicot", "Chepstow", "Usk"],
    Carmarthenshire: [
      "Carmarthen",
      "Llanelli",
      "Ammanford",
      "Llandeilo",
      "Kidwelly",
    ],
    Pembrokeshire: [
      "Haverfordwest",
      "Milford Haven",
      "Pembroke",
      "Tenby",
      "Fishguard",
    ],
    Ceredigion: ["Aberystwyth", "Cardigan", "Lampeter", "New Quay", "Tregaron"],
    Powys: [
      "Newtown",
      "Brecon",
      "Welshpool",
      "Llandrindod Wells",
      "Machynlleth",
    ],
    Gwynedd: ["Bangor", "Caernarfon", "Porthmadog", "Pwllheli", "Dolgellau"],
    Conwy: ["Llandudno", "Colwyn Bay", "Conwy", "Abergele", "Llanrwst"],
    Denbighshire: ["Ruthin", "Denbigh", "Rhyl", "Prestatyn", "St Asaph"],
    Flintshire: ["Mold", "Flint", "Connah's Quay", "Buckley", "Holywell"],
    "Isle of Anglesey": [
      "Llangefni",
      "Holyhead",
      "Beaumaris",
      "Amlwch",
      "Menai Bridge",
    ],
    "Neath Port Talbot": [
      "Neath",
      "Port Talbot",
      "Aberavon",
      "Glynneath",
      "Cimla",
    ],
  },
  "GB-NIR": {
    Belfast: ["Belfast", "Holywood", "Bangor", "Newtownards", "Carrickfergus"],
    "Derry City and Strabane": [
      "Derry",
      "Strabane",
      "Limavady",
      "Coleraine",
      "Magherafelt",
    ],
    "Antrim and Newtownabbey": [
      "Antrim",
      "Newtownabbey",
      "Ballyclare",
      "Crumlin",
      "Templepatrick",
    ],
    "Ards and North Down": [
      "Bangor",
      "Newtownards",
      "Holywood",
      "Donaghadee",
      "Comber",
    ],
    "Armagh City, Banbridge and Craigavon": [
      "Armagh",
      "Banbridge",
      "Craigavon",
      "Lurgan",
      "Portadown",
    ],
    "Causeway Coast and Glens": [
      "Coleraine",
      "Ballymoney",
      "Ballycastle",
      "Limavady",
      "Portrush",
    ],
    "Fermanagh and Omagh": [
      "Enniskillen",
      "Omagh",
      "Lisnaskea",
      "Irvinestown",
      "Fintona",
    ],
    "Lisburn and Castlereagh": [
      "Lisburn",
      "Castlereagh",
      "Dundonald",
      "Carryduff",
      "Hillsborough",
    ],
    "Mid and East Antrim": [
      "Ballymena",
      "Larne",
      "Carrickfergus",
      "Ballyclare",
      "Carnlough",
    ],
    "Mid Ulster": [
      "Dungannon",
      "Cookstown",
      "Magherafelt",
      "Coalisland",
      "Stewartstown",
    ],
    "Newry, Mourne and Down": [
      "Newry",
      "Downpatrick",
      "Warrenpoint",
      "Kilkeel",
      "Rathfriland",
    ],
  },
};

// Facility options will be loaded from API

// Time picker component for opening hours
const TimePicker = ({
  value,
  onChange,
  placeholder = "Select time",
}: {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}) => {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={styles.timeInput}
    />
  );
};

// Convert time format helper
const formatTimeForDisplay = (time: string): string => {
  if (!time) return "";

  // If it's already in HH:MM format, convert to 12-hour format
  if (time.includes(":")) {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  return time;
};

// Convert 12-hour format to 24-hour format
const convertTo24Hour = (time12: string): string => {
  if (!time12) return "";

  // If already in 24-hour format, return as is
  if (time12.includes(":")) {
    const [hours] = time12.split(":");
    if (hours.length === 2 && parseInt(hours) <= 23) {
      return time12;
    }
  }

  // Convert 12-hour format to 24-hour
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    const [, hours, minutes, period] = match;
    let hour = parseInt(hours);

    if (period.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  }

  return time12;
};

export default function AddCareHomePage() {
  const [formData, setFormData] = useState<CareHomeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);

  // Configuration data state
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const router = useRouter();
  const { createCareHome, getCareTypes, getSpecializations, getFacilities } =
    useAdminActions();

  // Fetch configuration data on component mount
  useEffect(() => {
    const loadConfigurationData = async () => {
      setIsLoadingConfig(true);
      try {
        // Load care types
        const careTypesResult = await getCareTypes();
        if (careTypesResult.success && careTypesResult.data) {
          setCareTypes(careTypesResult.data);
        }

        // Load specializations
        const specializationsResult = await getSpecializations();
        if (specializationsResult.success && specializationsResult.data) {
          setSpecializations(specializationsResult.data);
        }

        // Load facilities
        const facilitiesResult = await getFacilities();
        if (facilitiesResult.success && facilitiesResult.data) {
          setFacilities(facilitiesResult.data);
        }
      } catch (error) {
        console.error("Error loading configuration data:", error);
        toast.error("Failed to load configuration data");
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadConfigurationData();
  }, [getCareTypes, getSpecializations, getFacilities]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSpecializationChange = (specialization: string) => {
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleFacilityChange = (facilityId: string) => {
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      facilityIds: prev.facilityIds.includes(facilityId)
        ? prev.facilityIds.filter((id) => id !== facilityId)
        : [...prev.facilityIds, facilityId],
    }));
  };

  const handleOpeningHoursChange = (day: string, hours: string) => {
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: hours,
      },
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = ukCountries.find(
      (country) => country.code === countryCode
    );
    setFormData((prev) => ({
      ...prev,
      countryCode: countryCode,
      country: selectedCountry?.name || "",
      region: "", // Reset region when country changes
      city: "", // Reset city when country changes
    }));
  };

  const handleRegionChange = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      region: region,
      city: "", // Reset city when region changes
    }));
  };

  // Helper function to get cities for a country and region
  const getCitiesForRegion = (
    countryCode: string,
    region: string
  ): string[] => {
    const countryCities = ukCities[countryCode as keyof typeof ukCities];
    if (!countryCities) return [];

    const regionCities = countryCities[region as keyof typeof countryCities];
    return regionCities || [];
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleDescriptionChange = (value: string) => {
    // Split by line breaks and preserve all lines (including empty ones)
    const lines = value.split("\n");
    setFormData((prev) => ({
      ...prev,
      description: lines,
    }));
  };

  // Step-specific validation functions
  const validateStep0 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name?.trim()) errors.push("Care home name is required");
    if (!formData.careTypeId || formData.careTypeId === 0)
      errors.push("Care type must be selected");

    // Description validation - at least one non-empty line
    const nonEmptyDescriptionLines = formData.description.filter(
      (line) => line.trim() !== ""
    );
    if (nonEmptyDescriptionLines.length === 0) {
      errors.push("Description is required");
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateStep1 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.addressLine1?.trim())
      errors.push("Address line 1 is required");
    if (!formData.city?.trim()) errors.push("City is required");
    if (!formData.countryCode?.trim()) errors.push("Country is required");
    if (!formData.region?.trim()) errors.push("Region/County is required");
    if (!formData.postcode?.trim()) errors.push("Postcode is required");
    if (!formData.phone?.trim()) errors.push("Phone number is required");
    if (!formData.email?.trim()) errors.push("Email is required");
    // Website and Manager Name are now optional

    return { isValid: errors.length === 0, errors };
  };

  const validateStep2 = (): { isValid: boolean; errors: string[] } => {
    // Step 2 is now optional - always pass validation
    return { isValid: true, errors: [] };
  };

  const validateStep3 = (): { isValid: boolean; errors: string[] } => {
    // Specializations are now optional - always pass validation
    return { isValid: true, errors: [] };
  };

  const validateStep4 = (): { isValid: boolean; errors: string[] } => {
    // Opening hours are now optional - always pass validation
    return { isValid: true, errors: [] };
  };

  const validateStep5 = (): { isValid: boolean; errors: string[] } => {
    // Images are now optional - always pass validation
    return { isValid: true, errors: [] };
  };

  const validateCurrentStep = (): { isValid: boolean; errors: string[] } => {
    switch (currentStep) {
      case 0:
        return validateStep0();
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      default:
        return { isValid: true, errors: [] };
    }
  };

  // Function to check if a specific field has an error
  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors.some(
      (error) =>
        error.toLowerCase().includes(fieldName.toLowerCase()) ||
        error
          .toLowerCase()
          .includes(fieldName.replace(/([A-Z])/g, " $1").toLowerCase()) ||
        (fieldName === "country" && error.toLowerCase().includes("country")) ||
        (fieldName === "region" &&
          error.toLowerCase().includes("region/county")) ||
        (fieldName === "careTypeId" &&
          error.toLowerCase().includes("care type")) ||
        (fieldName === "addressLine1" &&
          error.toLowerCase().includes("address line 1")) ||
        (fieldName === "latitude" &&
          error.toLowerCase().includes("latitude")) ||
        (fieldName === "longitude" && error.toLowerCase().includes("longitude"))
    );
  };

  // Function to get CSS class for form group
  const getFormGroupClass = (fieldName: string): string => {
    return hasFieldError(fieldName)
      ? `${styles.formGroup} ${styles.error}`
      : styles.formGroup;
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic Information validation - only required fields
    if (!formData.name?.trim()) errors.push("Care home name is required");
    if (!formData.phone?.trim()) errors.push("Phone number is required");
    if (!formData.email?.trim()) errors.push("Email is required");

    // Optional fields - only validate if provided
    if (formData.website && !formData.website.trim())
      errors.push("Website cannot be empty if provided");
    if (
      formData.totalBeds !== undefined &&
      formData.totalBeds !== null &&
      formData.totalBeds <= 0
    )
      errors.push("Total beds must be greater than 0 if provided");
    if (formData.contactInfo?.manager && !formData.contactInfo.manager.trim())
      errors.push("Manager contact cannot be empty if provided");

    // Location validation - required fields
    if (!formData.addressLine1?.trim())
      errors.push("Address line 1 is required");
    if (!formData.city?.trim()) errors.push("City is required");
    if (!formData.region?.trim()) errors.push("Region is required");
    if (!formData.postcode?.trim()) errors.push("Postcode is required");

    // Coordinate validation - only validate if coordinates are provided (not 0)
    if (
      formData.latitude !== 0 &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      errors.push("Latitude must be between -90 and 90 degrees");
    }
    if (
      formData.longitude !== 0 &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      errors.push("Longitude must be between -180 and 180 degrees");
    }

    // Pricing validation - optional fields
    if (
      formData.weeklyPrice !== undefined &&
      formData.weeklyPrice !== null &&
      formData.weeklyPrice <= 0
    )
      errors.push("Weekly price must be greater than 0 if provided");
    if (
      formData.monthlyPrice !== undefined &&
      formData.monthlyPrice !== null &&
      formData.monthlyPrice <= 0
    )
      errors.push("Monthly price must be greater than 0 if provided");
    if (
      formData.availableBeds !== undefined &&
      formData.availableBeds !== null &&
      formData.availableBeds <= 0
    )
      errors.push("Available beds must be greater than 0 if provided");

    // Services validation - only care type is required
    if (!formData.careTypeId || formData.careTypeId === 0)
      errors.push("Care type must be selected");
    // Specializations are optional

    // Opening hours validation - optional
    // Opening hours are optional

    // Contact info validation - optional
    if (
      formData.contactInfo?.emergency &&
      !formData.contactInfo.emergency.trim()
    )
      errors.push("Emergency contact cannot be empty if provided");

    // Images validation - optional
    // Images are optional

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    // Check if the "Add Care Home" button was clicked
    // if (!isAddButtonClicked) {
    //   toast.error("Please click the 'Add Care Home' button to submit the form");
    //   return;
    // }

    // Validate form before submission
    const validation = validateForm();
    if (!validation.isValid) {
      toast.error(
        `Please fix the following errors:\n${validation.errors.join("\n")}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for API submission
      const careHomeData = {
        ...formData,
        // Ensure all required fields are present
        description: formData.description.filter((line) => line.trim() !== ""),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
        // Handle coordinates - only send if they are valid
        latitude:
          formData.latitude >= -90 && formData.latitude <= 90
            ? formData.latitude
            : undefined,
        longitude:
          formData.longitude >= -180 && formData.longitude <= 180
            ? formData.longitude
            : undefined,
      };

      const result = await createCareHome(
        careHomeData as unknown as CreateCareHomeData
      );

      if (result.success) {
        toast.success("Care home added successfully!");
        setIsAddButtonClicked(false); // Reset the flag on success
        router.push("/admin/care-homes");
      } else {
        toast.error(result.error || "Failed to add care home");
        setIsAddButtonClicked(false); // Reset the flag on error
      }
    } catch (error) {
      console.error("Error creating care home:", error);
      toast.error("Failed to add care home. Please try again.");
      setIsAddButtonClicked(false); // Reset the flag on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      id: "basic",
      label: "Basic Information",
      description: "Care home name and type",
    },
    {
      id: "location",
      label: "Location & Contact",
      description: "Address and contact details",
    },
    {
      id: "pricing",
      label: "Pricing & Capacity",
      description: "Costs and bed availability",
    },
    {
      id: "services",
      label: "Services & Facilities",
      description: "Specializations and amenities",
    },
    {
      id: "hours",
      label: "Opening Hours",
      description: "Daily operating hours",
    },
    { id: "media", label: "Images & Media", description: "Photos and media" },
  ];

  return (
    <AdminLayout>
      <div className={styles.addCareHomeContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
            </Link>
            <h1>Add New Care Home</h1>
          </div>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className={styles.stepsIndicator}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.step} ${
                  index <= currentStep ? styles.completed : ""
                } ${index === currentStep ? styles.current : ""}`}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepLabel}>{step.label}</div>
                  <div className={styles.stepDescription}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className={styles.form}>
          {/* Basic Information Step */}
          {currentStep === 0 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Basic Information</h3>
                <div className={styles.formGrid}>
                  <div className={getFormGroupClass("name")}>
                    <label htmlFor="name">
                      Care Home Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter care home name"
                    />
                  </div>

                  <div className={getFormGroupClass("description")}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description.join("\n")}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      rows={6}
                      placeholder="Enter care home description...&#10;&#10;Each line will be treated as a separate paragraph.&#10;Press Enter to create new lines.&#10;Empty lines will be automatically removed."
                    />
                    <div className={styles.helpText}>
                      Each line will be treated as a separate paragraph. Press
                      Enter to create new lines. Empty lines will be
                      automatically removed when saving.
                    </div>
                  </div>

                  <div className={getFormGroupClass("careTypeId")}>
                    <label htmlFor="careTypeId">
                      Care Type <span>*</span>
                    </label>
                    <select
                      id="careTypeId"
                      name="careTypeId"
                      value={formData.careTypeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select care type</option>
                      {isLoadingConfig ? (
                        <option value="">Loading care types...</option>
                      ) : (
                        careTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location & Contact Step */}
          {currentStep === 1 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Address Information</h3>
                <div className={styles.formGrid}>
                  <div className={getFormGroupClass("addressLine1")}>
                    <label htmlFor="addressLine1">
                      Address Line 1 <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                      placeholder="Street address"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className={getFormGroupClass("country")}>
                    <label htmlFor="country">
                      Country <span>*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      required
                    >
                      <option value="">Select country</option>
                      {ukCountries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={getFormGroupClass("region")}>
                    <label htmlFor="region">
                      State <span>*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      required
                      disabled={!formData.countryCode}
                    >
                      <option value="">Select region/county</option>
                      {formData.countryCode &&
                        ukRegions[
                          formData.countryCode as keyof typeof ukRegions
                        ]?.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className={getFormGroupClass("city")}>
                    <label htmlFor="city">
                      City <span>*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.region}
                    >
                      <option value="">Select city</option>
                      {getCitiesForRegion(
                        formData.countryCode,
                        formData.region
                      ).map((city: string) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={getFormGroupClass("postcode")}>
                    <label htmlFor="postcode">
                      Postcode <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                      placeholder="Postcode"
                    />
                  </div>

                  <div className={getFormGroupClass("latitude")}>
                    <label htmlFor="latitude">Latitude (optional)</label>
                    <input
                      type="number"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude || ""}
                      onChange={handleInputChange}
                      step="0.000001"
                      min="-90"
                      max="90"
                      placeholder="57.6869 (Fraserburgh)"
                    />
                    <small className={styles.helpText}>
                      Must be between -90 and 90 degrees. Leave as 0 if unknown.
                    </small>
                    {formData.latitude !== 0 &&
                      (formData.latitude < -90 || formData.latitude > 90) && (
                        <div className={styles.errorMessage}>
                          Latitude must be between -90 and 90 degrees
                        </div>
                      )}
                  </div>

                  <div className={getFormGroupClass("longitude")}>
                    <label htmlFor="longitude">Longitude (optional)</label>
                    <input
                      type="number"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude || ""}
                      onChange={handleInputChange}
                      step="0.000001"
                      min="-180"
                      max="180"
                      placeholder="-2.0054 (Fraserburgh)"
                    />
                    <small className={styles.helpText}>
                      Must be between -180 and 180 degrees. Leave as 0 if
                      unknown.
                    </small>
                    {formData.longitude !== 0 &&
                      (formData.longitude < -180 ||
                        formData.longitude > 180) && (
                        <div className={styles.errorMessage}>
                          Longitude must be between -180 and 180 degrees
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Contact Information *</h3>
                <div className={styles.formGrid}>
                  <div className={getFormGroupClass("phone")}>
                    <label htmlFor="phone">
                      Phone Number <span>*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+44 161 123 4567"
                    />
                  </div>

                  <div className={getFormGroupClass("email")}>
                    <label htmlFor="email">
                      Email <span>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="info@carehome.co.uk"
                    />
                  </div>

                  <div className={getFormGroupClass("website")}>
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.carehome.co.uk"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="emergency">Emergency Contact *</label>
                    <input
                      type="tel"
                      id="emergency"
                      value={formData.contactInfo.emergency}
                      onChange={(e) =>
                        handleContactInfoChange("emergency", e.target.value)
                      }
                      placeholder="Emergency phone number"
                    />
                  </div>

                  <div className={getFormGroupClass("manager")}>
                    <label htmlFor="manager">Manager Name</label>
                    <input
                      type="text"
                      id="manager"
                      value={formData.contactInfo.manager}
                      onChange={(e) =>
                        handleContactInfoChange("manager", e.target.value)
                      }
                      placeholder="Manager's name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Capacity Step */}
          {currentStep === 2 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Pricing Information</h3>
                <div className={styles.formGrid}>
                  <div className={getFormGroupClass("weeklyPrice")}>
                    <label htmlFor="weeklyPrice">Weekly Price (£)</label>
                    <input
                      type="number"
                      id="weeklyPrice"
                      name="weeklyPrice"
                      value={formData.weeklyPrice || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="1200"
                    />
                  </div>

                  <div className={getFormGroupClass("monthlyPrice")}>
                    <label htmlFor="monthlyPrice">Monthly Price (£)</label>
                    <input
                      type="number"
                      id="monthlyPrice"
                      name="monthlyPrice"
                      value={formData.monthlyPrice || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="4800"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Capacity Information</h3>
                <div className={styles.formGrid}>
                  <div className={getFormGroupClass("totalBeds")}>
                    <label htmlFor="totalBeds">Total Beds</label>
                    <input
                      type="number"
                      id="totalBeds"
                      name="totalBeds"
                      value={formData.totalBeds || ""}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="50"
                    />
                  </div>

                  <div className={getFormGroupClass("availableBeds")}>
                    <label htmlFor="availableBeds">Available Beds</label>
                    <input
                      type="number"
                      id="availableBeds"
                      name="availableBeds"
                      value={formData.availableBeds || ""}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services & Facilities Step */}
          {currentStep === 3 && (
            <div className={styles.tabContent}>
              <div className={getFormGroupClass("specializations")}>
                <h3>Specializations</h3>
                <div className={styles.checkboxGrid}>
                  {isLoadingConfig ? (
                    <div className={styles.loadingMessage}>
                      Loading specializations...
                    </div>
                  ) : (
                    specializations.map((specialization) => (
                      <div
                        key={specialization.id}
                        className={styles.checkboxItem}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(
                              specialization.name
                            )}
                            onChange={() =>
                              handleSpecializationChange(specialization.name)
                            }
                          />
                          {specialization.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Facilities</h3>
                <div className={styles.checkboxGrid}>
                  {isLoadingConfig ? (
                    <div className={styles.loadingMessage}>
                      Loading facilities...
                    </div>
                  ) : (
                    facilities.map((facility) => (
                      <div key={facility.id} className={styles.checkboxItem}>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.facilityIds.includes(facility.id)}
                            onChange={() => handleFacilityChange(facility.id)}
                          />
                          {facility.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Opening Hours Step */}
          {currentStep === 4 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Opening Hours</h3>
                <div className={styles.formGrid}>
                  {Object.entries(formData.openingHours).map(([day, hours]) => {
                    // Parse the current hours string to get opening and closing times
                    const timeMatch = hours.match(
                      /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
                    );
                    const openingTime = timeMatch
                      ? convertTo24Hour(timeMatch[1])
                      : "09:00";
                    const closingTime = timeMatch
                      ? convertTo24Hour(timeMatch[2])
                      : "17:00";

                    return (
                      <div key={day} className={styles.formGroup}>
                        <label htmlFor={`${day}-opening`}>{day}</label>
                        <div className={styles.timePickerContainer}>
                          <div className={styles.timePickerGroup}>
                            <label htmlFor={`${day}-opening`}>Opening</label>
                            <TimePicker
                              value={openingTime}
                              onChange={(time) => {
                                const newHours = `${formatTimeForDisplay(
                                  time
                                )} - ${formatTimeForDisplay(closingTime)}`;
                                handleOpeningHoursChange(day, newHours);
                              }}
                              placeholder="Opening time"
                            />
                          </div>
                          <div className={styles.timePickerGroup}>
                            <label htmlFor={`${day}-closing`}>Closing</label>
                            <TimePicker
                              value={closingTime}
                              onChange={(time) => {
                                const newHours = `${formatTimeForDisplay(
                                  openingTime
                                )} - ${formatTimeForDisplay(time)}`;
                                handleOpeningHoursChange(day, newHours);
                              }}
                              placeholder="Closing time"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Images & Media Step */}
          {currentStep === 5 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Images</h3>
                <div className={styles.imageUrlsContainer}>
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className={styles.imageUrlItem}>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          handleImageUrlChange(index, e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className={styles.addButton}
                  >
                    + Add Image URL
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={styles.secondaryButton}
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  const validation = validateCurrentStep();
                  if (!validation.isValid) {
                    setValidationErrors(validation.errors);
                    return;
                  }
                  setValidationErrors([]);
                  setCurrentStep(currentStep + 1);
                }}
                className={styles.primaryButton}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.primaryButton}
                onClick={() => handleSubmit()}
              >
                {isSubmitting ? "Adding Care Home..." : "Add Care Home"}
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
