export type SubmissionInput = {name:string;category_slug:string;locality_slug:string;address:string;phone:string;whatsapp:string;description:string;applicant_email:string;consent:boolean;whatsapp_consent:boolean};
export function validateSubmission(value: unknown): {data?:SubmissionInput;errors:string[]} {
 if (!value || typeof value!=="object" || Array.isArray(value)) return {errors:["Submission must be an object."]};
 const v=value as Record<string,unknown>;
 const s=(key:string)=>typeof v[key]==="string"?(v[key] as string).trim():"";
 const data:SubmissionInput={name:s("name"),category_slug:s("category_slug"),locality_slug:s("locality_slug"),address:s("address"),phone:s("phone"),whatsapp:s("whatsapp"),description:s("description"),applicant_email:s("applicant_email").toLowerCase(),consent:v.consent===true,whatsapp_consent:v.whatsapp_consent===true};
 const errors:string[]=[];
 if(data.name.length<2||data.name.length>140)errors.push("Business name must be 2–140 characters.");
 for(const key of ["category_slug","locality_slug"] as const)if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data[key])||data[key].length>100)errors.push("Choose a valid category and neighbourhood.");
 if(data.address.length<5||data.address.length>500)errors.push("Address must be 5–500 characters.");
 if(!/^\+91[6-9][0-9]{9}$/.test(data.phone))errors.push("Enter an Indian phone number in +91 format.");
 if(data.whatsapp_consent&&!/^\+91[6-9][0-9]{9}$/.test(data.whatsapp))errors.push("Enter a valid consented WhatsApp number.");
 if(!data.whatsapp_consent)data.whatsapp="";
 if(data.description.length<20||data.description.length>2000)errors.push("Description must be 20–2,000 characters.");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.applicant_email)||data.applicant_email.length>254)errors.push("Enter a valid contact email.");
 if(!data.consent)errors.push("Confirm that you’re authorized and consent to publication of the supplied business details.");
 return errors.length?{errors}:{data,errors};
}
