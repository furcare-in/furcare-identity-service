const anesthesiaPatientMonitoringData = `<h2>Anesthesia &amp; Surgery</h2><p><br></p><h3>Anesthesia Administration and Monitoring</h3><h4>PATIENT ASA STATUS (I-V):</h4><h4>PREOPERATIVE PAIN ASSESSMENT (0-4):</h4><h4>ANESTHETIC PROTOCOL UTILIZED:</h4><p><br></p><h4>PREMEDICATIONS ADMINISTERED:</h4><ul><li><strong>Medication:</strong></li><li>Concentration (mg/mL):</li><li>Quantity (mL):</li><li>Route:</li><li>Time administered:</li><li>Administered by:</li><li><strong>Medication:</strong></li><li>Concentration (mg/mL):</li><li>Quantity (mL):</li><li>Route:</li><li>Time administered:</li><li>Administered by:</li><li><strong>Medication:</strong></li><li>Concentration (mg/mL):</li><li>Quantity (mL):</li><li>Route:</li><li>Time administered:</li><li>Administered by:</li></ul><p><br></p><h4>PREINDUCTION EVALUATION:</h4><ul><li>Time:</li><li>Temp:</li><li>HR:</li><li>RR:</li><li>Pulse quality:</li><li>Other physical examination changes:</li><li>Sedation level: none / mild / adequate / excessive / dysphoric</li></ul><p><br></p><h4>IV CATHETER:</h4><ul><li>Size (gauge):</li><li>Right cephalic: ____</li><li>Left cephalic: ____</li><li>Right medial saphenous: ____</li><li>Left medial saphenous: ____</li><li>Right lateral saphenous: ____</li><li>Left Lateral Saphenous: ____</li><li>Other: ____</li></ul><p><br></p><h4>EQUIPMENT:</h4><ul><li>Anesthesia Machine Checklist completed: ____ Yes ____ No</li><li>Breathing circuit:</li><li class="ql-indent-1">Non-rebreathing (&lt;7kg): ____</li><li class="ql-indent-1">Rebreathing (&gt;7kg): Adult ____ Pediatric ____</li><li class="ql-indent-1">Bag size (L): ____</li></ul><p><br></p><p><br></p><h2>INDUCTION AND INTUBATION PHASE:</h2><ul><li>Preoxygenation administered: ____ Yes ____ No</li><li>If yes, record rate (L/min): ____</li><li>Method (flow by, mask, etc.): ____</li><li>Length of time (minutes): ____</li><li>Endotracheal tube size: ____ mm</li><li>Cuff inflated for leak test: ____ Yes ____ No</li></ul><p><br></p><h4>IV induction agent and concentration:</h4><ul><li>Quantity:</li><li>Time:</li><li>Administered by:</li></ul><p><br></p><p><br></p><h3>LOCAL AND REGIONAL BLOCKS (as medically indicated or required):</h3><ol><li><strong>Medication:</strong></li><li>Concentration (mg/mL):</li><li>Quantity (mL):</li><li>Route:</li><li>Time administered:</li><li>Administered by:</li></ol><p><br></p><p><br></p><h2>MAINTENANCE / MONITORING</h2><p>TimeSevo %O2 FlowFluids (mL/hr)HRRRPulse qualityCRT/MMTempSpO2ECG rhythmEtCO2SAPDAPMAP</p><h4>Interventions or remarks (including time):</h4><ul><li>Procedure/surgery start time:</li><li>Procedure end time:</li><li>Inhalant anesthesia end time:</li><li>100% O2 end time:</li><li>Total fluids administered during anesthesia:</li></ul><p><br></p><p><br></p><h4>PERIOPERATIVE MEDICATIONS ADMINISTERED:</h4><ol><li><strong>Medication:</strong></li><li>Concentration (mg/mL):</li><li>Quantity (mL):</li><li>Route:</li><li>Time administered:</li><li>Administered by:</li></ol><p><br></p><p><br></p><p>... (Content truncated for brevity) ...</p>`;

const canineCastration = `<h2>Canine Castration:</h2><p><br></p><p>Surgical site shaved and prepped with surgical scrub and alcohol.</p><p><br></p><p>Ventral midline incision cranial to scrotum.</p><p><br></p><p>Removed testicles as follows:</p><p><br></p><p>Subcutaneous closure as follows:</p><p><br></p><p>Skin closure as follows:</p><p><br></p><p>Suture material utilized:</p><p><br></p><p>Surgical complications noted or additional remarks</p>`;

const canineSpay = `<h2>Canine Spay - Ovariohysterectomy:</h2><p><br></p><p>Surgical site shaved and prepped with surgical scrub and alcohol.</p><p><br></p><p>____ cm ventral midline incision.</p><p><br></p><p>Ovaries and uterus excised and pedicles ligated as follows:</p><p><br></p><p>Closure of linea alba as follows: Subcutaneous closure as follows:</p><p><br></p><p>Skin closure as follows:</p><p><br></p><p>Suture material utilized:</p>`;

const dentalProphylaxis = `<h2>Dental Prophylaxis:</h2><p><br></p><p>All teeth scaled with an ultrasonic scaler, all teeth polished with prophy paste.</p><p>Examination of the oral cavity completed by the veterinarian including assessment of all teeth with dental probe.</p><p><br></p><p>Dental Chart:</p><p><br></p><p>Calculus (0-4)</p><p><br></p><p>Gingivitis (0-4)</p><p><br></p><p>Periodontal Disease (0-4)</p><p><br></p><p>Bite:</p><p><br></p><p>Oral Cavity:</p><p><br></p><p>Missing:</p><p><br></p><p>Retained:</p><p><br></p><p>Pathology:</p><p><br></p><p>[Fractured Closed/Open (FC/FO), Worn (W), Pockets (PK mm), Caries (C), Mobility (M1-3), Neck Lesion (NL), Root Exposure (RE)]</p><p><br></p><p>Radiograph Findings:</p><p><br></p><p>Extracted:</p><p><br></p><p>Extraction Surgical Notes:</p>`;

const felineCastration = `<h2>Feline Castration:</h2><p><br></p><p>Surgical site prepared and prepped with surgical scrub and alcohol.</p><p><br></p><p>Scrotal incision made over each testicle.</p><p><br></p><p>Testicular vessels and cord ligated as follows:</p><p><br></p><p>Surgical complications noted or additional remarks:</p>`;

const anesthesiaRiskAndBenifit = `<h2>Anesthesia Risk/Benefit:</h2><p><br></p><p>The potential risks and negative outcomes associated with anesthesia and/or surgery, including potential adverse reactions, have been discussed with the client. This discussion has included the following marked items:</p><p><br></p><p>Risk of anesthesia, inclusive of death</p><p><br></p><p>Risk of hemorrhage (bleeding)</p><p><br></p><p>Risk of incision site infection or dehiscence</p><p><br></p><p>Risk of surgical complications, potentially requiring additional surgeries / procedures</p><p><br></p><p>Risk of progressive / non curable disease</p>`;

const clientConnectionCalls = `<h2>Client Connections Call </h2><p><br></p><p>{User FullName} called {Client.FullName} today to connect.</p><p><br></p><p>Purpose:</p><p><br></p><p>Topics Discussed:</p><p><br></p><p>Benefits:</p>`;

const followUpCall = `<h2>Follow up call</h2><p><br></p><p>{User FullName} called {Client.FullName} today to followup</p><p><br></p><p>Purpose:</p><p><br></p><p>Frequency:</p><p><br></p><p>Topics Discussed:</p><p><br></p><p>Benefits:</p>`;

const noExamPerformed = `<h2>No Exam Performed</h2><p><br></p><p>No physical examination was conducted on this pet by a doctor. The assigned doctor was supposed to perform the exam; however, the client and the pet left the hospital before the examination could take place. All preliminary information was provided by a veterinary technician or veterinary assistant but was not reviewed by a doctor. As a result, there were no diagnoses or treatments administered for this pet.</p>`;

const referralImmediateCare = `<h2>Referral for Immediate Critical Care</h2><p><br></p><p>When:</p><p><br></p><p>Your pet needs to seek care at a referral hospital now.</p><p><br></p><p>What is a referral?</p><p><br></p><p>Your pet has been referred to critical care. These hospitals have specially trained doctors and veterinary teams that can evaluate and stabilize your pet quickly and compassionately.</p><p><br></p><p>In-house diagnostics and state-of-the-art intensive care units allow them to provide pets with the full care they need. Most of these hospitals are open 24/7, every day of the year, including holidays.</p><p><br></p><p><br></p><p>Why is this important?</p><p><br></p><p>The care at a critical care facility may be vital to your pet’s diagnosis, treatment and possibly survival. They offer 24- hour hospitalization and critical care that is not available at Banfield.</p><p><br></p><p>What happens if I do not go?</p><p><br></p><p>Declining a referral can change the extent our teams diagnose and/or treat your pet. Your pet could decline if pet’s care is stopped and not pursued elsewhere.</p><p><br></p><p>Please inform if you will not be continuing treatment at the referral hospital.</p><p><br></p><p>It is important we notify the critical care hospital that you will not be arriving. It is also important that our teams follow up and possibly change recheck timing or treatments based on not pursuing referral.</p><p><br></p><p>Please call our hospital if you have any question or concerns about your referral</p>`;

const referralToSpecialist = `<h2>Referral to Specialist</h2><p><br></p><p>Referral: Your Next Step</p><p><br></p><p>Expanding your Pet's Veterinary Team:</p><p><br></p><p>As your vet, we know you and your pet. There are other professionals that may add to your pet's care. Together, we work to develop a comprehensive treatment plan for your pet.</p><p><br></p><p>What is a referral? Your pet has been referred. This referral is a medical directive for your pet to visit a veterinarian or veterinary hospital that provides additional or advanced care in areas such as eyes, hearts, bones, etc. Your pet requires this special expertise or equipment for continued diagnosis and/or treatment.</p><p><br></p><p>Why is this important?</p><p><br></p><p>This care may expedite your pet's diagnosis and treatment. They may offer testing and/or treatment that is not available at Banfield.</p><p><br></p><p>What happens if I do not go?</p><p><br></p><p>Declining a referral can change the extent that our teams can diagnose and/or treat your pet. Your pet could decline if care is not continued.</p><p><br></p><p>Please inform Banfield if you will not be pursuing treatment at the referral hospital. It is important we notify the referral hospital. It is also important that our teams follow up and possibly change recheck timing or treatments based on not pursuing referral.</p><p><br></p><p>Please call our hospital if you have any questions or concerns about your referral.</p>`;

const vaccineRiskAndbenefit = `<h2>Vaccine Benefit/Risk:</h2><p><br></p><p>The client has been informed about the benefits and risks of vaccination, including possible adverse reactions. </p><p><br></p><p>Details:</p>`;

const abscess = `<h2>Abscess</h2><p><br></p><p>An abscess is a pocket of infected material, or pus, consisting of bacteria or other organisms, as well as red and white blood cells. This type of infection has many causes. Often, a bite or other penetrating wound carries bacteria into the tissues. Infection builds at the site, which produces pus. If the pus has no place to drain out of the body, an abscess forms under the skin or in deeper tissues, causing significant damage and endangering the pet.</p><p><br></p><p>Common signs of an abscess include a painful area, swelling, or mass with bruising and foul-smelling discharge at the site. The pet may become depressed, feverish, painful or reluctant to move. Decreased appetite or water intake may occur as well.</p><p><br></p><p>Abscesses are diagnosed using symptoms, examination findings, history, blood testing, and sometimes x-rays. Treatment depends on the severity of the abscess. Antibiotics are needed to control infection. Many abscesses require surgical removal of infected tissue and drainage. Often a surgical drain will need to be left in place for a few days. Good wound care and cleaning are essential to speed up the healing process.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Follow all wound care instructions.</p><p><br></p><p>Keep your pet indoors or in a confined area during the treatment period.</p><p><br></p><p>Do not allow any chewing, licking or scratching at surgical drains or stitches.</p><p><br></p><p>An Elizabethan (cone shaped) collar will probably be required.</p><p><br></p><p>Monitor your pet carefully and have him/her rechecked as recommended by your veterinarian.</p><p><br></p><p>Please contact the medical team if you have any questions.</p>`;

const allergicReaction = `<h2>Allergic Reaction</h2><p><br></p><p>The immune system is designed to protect the body from infection. A normal functioning system recognizes things that are "non-self" such as bacteria, viruses, other microorganisms, pollen, and other small particles that enter or contact the body. The immune system processes the invaders to help prevent disease. In some instances, the immune system can overreact, causing mild to severe, life-threatening disease, manifesting as an "allergic reaction." Almost any substance can potentially cause an allergic reaction including food, insect bites, medications, grooming products, vaccines, and inhaled particles like dust or pollen.</p><p><br></p><p>Mild to moderate reactions may include swelling or irritation of the skin, especially around the face, head, and feet. Hives, rashes, blisters, clear discharge from eyes or nostrils, sneezing, itching, and mild discomfort may also be present. More serious reactions include all of the above as well as difficulty breathing, choking, coughing, severe swelling or skin reactions, pain, depression, and anaphylactic shock (this is a severe, immediate, and life-threatening immune reaction that requires emergency treatment).</p><p><br></p><p>Diagnosis is based on history, symptoms, and examination findings. All allergic reactions should receive prompt medical treatment. The treatment varies based on severity but usually includes antihistamines and other medications to control the allergic reaction. Severe cases may require additional medications, breathing support, cardiac monitoring, fluid therapy, and hospitalization.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked if there are any concerns.</p><p><br></p><p>Have your pet rechecked as recommended by your veterinarian.</p><p><br></p><p>Please call the medical team if you have any questions.</p>`;

const analSacDisease = `<h2>Anal Sac (Gland) Disease</h2><p><br></p><p>Dogs and cats have two glands located just inside the anal opening called anal sacs, or anal glands. The glands are normal structures that produce fluid with an unpleasant odor. These sacs can become infected, inflamed, or cancerous. In some Pets, full sacs may cause irritation that manifests itself as scooting, licking or chewing at the area. Having the sacs emptied by trained personnel can usually relieve the discomfort if the glands are otherwise normal.</p><p><br></p><p>Sacs that are irritated or not able to empty well may become clogged (impacted) which can lead to an anal gland abscess. Abscesses are usually very painful, swollen, and may drain. Cancer can also arise in the glands, producing a swollen or ulcerated mass near the anus.</p><p><br></p><p>Diagnosis is usually based on symptoms and physical examination. Laboratory testing may also be necessary. Treatment varies with the type and severity of the disease. Infected or inflamed glands will require antibiotics. Abscesses may require surgical drainage and wound care at home in addition to antibiotics. Sacs that cause recurrent problems or become cancerous may need to be surgically removed.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Your pet's anal sacs may need to be expressed frequently.</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked if there are any concerns.</p><p><br></p><p>Have your pet rechecked as recommended by your veterinarian.</p><p><br></p><p>Please call the medical team if you have any questions.</p>`;

const atopy = `<h2>Atopy / Food Related Allergic Skin Disease</h2><p><br></p><p>Atopy and food related allergic skin disease are caused by reactions to be inhaled, ingested, or absorbed "allergens" (pollen, mold spores, dust, dust mites, food, etc.). This is similar to "hay fever" in humans. However, instead of the sinus and nasal signs in humans, pets may manifest the disease as skin irritation that can include the entire skin surface and ear canals.</p><p><br></p><p>Allergic pets may constantly scratch and bite at the skin. Some may chew or lick themselves until wounds form. Other signs include rubbing, redness of the skin (especially on face and feet), ear infections or inflammation, and hair loss. Thickened or darkened skin may develop under the armpits, on the abdomen, inside the earflaps, or around the anus. The irritated skin can easily become infected by bacteria or yeast which already exist on normal skin.</p><p><br></p><p>These types of allergies are often diagnosed by a combination of symptoms, examination findings, history, and response to treatment. Specialized allergy testing may help reveal what is causing the reaction and allow for "hyposensitization," or individualized allergy medication, that can be helpful in treatment. Numerous medications, special diets, and topical skin treatments are available to reduce symptoms and discomfort.</p><p><br></p><p>Allergic skin disease can be difficult and frustrating to treat. For some pets, it becomes a recurrent problem that requires careful home care and compliance with all veterinary instructions for relief of symptoms.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Year-round flea and skin parasite control is essential.</p><p><br></p><p>If a special diet has been recommended for your pet, please do not offer ANY other food, treats, table food, dietary supplements or flavored medications. Even small amounts of another food can lead to a recurrence of clinical symptoms.</p><p><br></p><p>Routine ear cleanings with a veterinarian recommended cleaner may reduce the chance of ear infections, especially after swimming or bathing.</p><p><br></p><p>Monitor your pet's skin and ears for problems and seek treatment early.</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>It is important to check your pet's progress as recommended by your veterinarian.</p><p><br></p><p>Please contact the medical team if you have questions.</p>`;

const canineinfluenzaVaccine = `<h2>Canine Influenza Vaccine</h2><p><br></p><p>Your pet received the canine influenza vaccine today. Canine influenza is a highly contagious upper respiratory disease, and symptoms are similar to Bordetella (often referred to as "kennel cough").</p><p><br></p><p>As of March 2015, there are 2 strains of canine influenza circulating in the United States. Information about canine influenza is changing rapidly, so please refer to the references for the most recent information. Currently, the influenza vaccine is not designed to completely prevent the disease but instead will help to decrease the clinical symptoms (coughing, sneezing, and eye/nose discharge). Vaccination should also help protect your pet's lungs from long term damage due to secondary infections (pneumonia) and inflammation.</p><p><br></p><p>Depending on the strain of canine influenza, other pets (cats, ferrets, etc) may potentially be at risk for contracting influenza from an infected dog.</p><p><br></p><p>If you have any questions about canine influenza or the vaccination, please contact your {Hospital Name}.</p><p><br></p><p>References and suggested reading:</p>`;

const canineParvoVirus = `<h2>Canine Parvo Virus</h2><p><br></p><p>Parvovirus usually attacks the stomach and intestines. Occasionally, it can infect heart tissue as well, causing sudden death. Young, unvaccinated or partially vaccinated dogs and puppies are at greatest risk. However, any dog can become infected with the disease. On rare occasions, a completely vaccinated pet can contract Parvo if his or her immune system has not responded properly to vaccination.</p><p><br></p><p>The virus is shed in a stool and can remain infectious in contaminated areas for months, even though freezing temperatures. It can be transmitted from dog to dog through stool, from contaminated areas, and even on clothing or shoes.</p><p><br></p><p>The hallmarks of Parvo are vomiting and diarrhea. Depression, fever, abdominal pain, decreased appetite, decreased water intake, weakness, weight loss, and other abnormalities can accompany the infection. Severe and/or bloody diarrhea or vomiting can easily lead to fatal dehydration, blood loss and intestinal damage. Damaged intestines can leak deadly bacterial toxins into the body. This disease requires immediate and thorough treatment.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, stool and blood tests, and response to treatment. X-rays are sometimes necessary. Treatment depends on the type, severity, and duration of the disease. Antibiotics, dewormers, intestinal medications, fluid and electrolyte therapy, and special diets are needed as appropriate. Many pets require intensive intravenous treatments and may remain hospitalized for days. Even with the best possible care, some critically ill patients still die. Good nursing care is essential to recovery.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked if there are any concerns.</p><p><br></p><p>Separate any ill pets from others and use separate feeding, bedding, and grooming items. Wash your hands after handling it to reduce the chance of disease transmission.</p><p><br></p><p>If a special diet has been recommended for your pet, please do not offer any other food or treats and feed him/her as directed by your doctor. Ensure that your pet has access to fresh water at all times.</p><p><br></p><p>The medical team may have additional recommendations about disinfection.</p><p><br></p><p>Have your pet rechecked as recommended by your veterinarian.</p><p><br></p><p>Please contact the medical team if you have any questions.</p>`;

const cataracts = `<h2>Cataracts</h2><p><br></p><p>A cataract is a clouding of the lens of the eye that interferes with the normal lens function. Cataracts are often age related. Injury, infections, toxins, congenital or inherited abnormalities, and several diseases (including diabetes) can cause cataract formation as well. Cataracts can range from small, faint spots to total and profound clouding of the entire lens. Cataracts (especially when age related) often become progressively worse over time. In severe cases, little or no light can pass to the back of the eye, resulting in blindness.</p><p><br></p><p>Diagnosis is based examination findings that include a clouded appearance or "milky" flecks or lines in the normally clear eye lens. A complete eye examination is important to access the lens and health of the eye and its surrounding tissues. Laboratory tests may be necessary to check for underlying infection or disease.</p><p><br></p><p>Surgical removal is the only reliable treatment for serious cataract formation. Any underlying problems such as injury, infection, or systemic disease must also be addressed. Surgery is considered in cases where the rest of the eye is normal, no serious underlying disease is present, and the possibility to restore adequate sight is high. Some owners choose not to pursue cataract surgery. If cared for properly, a visually impaired pet can remain an active part of the family and have a good quality of life.</p><p><br></p><p>*** IMPORTANT POINTS IN CARE***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Feel free to discuss prognosis and treatment options with your veterinarian.</p><p><br></p><p>Monitor your pet's eyes and overall health carefully. Have him/her rechecked if you have any concerns.</p><p><br></p><p>If your pet has any loss of vision, be sure he/she is kept in a safe, secure environment at all times. Visually impaired pets are at greater risk of becoming lost or injured.</p><p><br></p><p>Please feel free to contact the medical team if you have any questions.</p>`;

const cornealUlcer = `<h2>Corneal Ulcer, Abrasion, and Laceration</h2><p><br></p><p>The cornea is the clear surface of the eyeball (where a contact lens would be worn in humans). Like skin, this tissue can be damaged by scratches, scrapes, or cuts. These injuries are usually very painful and have the potential to become infected. Serious damage or infection can cause permanent corneal scarring, injury to deeper tissues of the eye, permanent vision loss, and even loss of the eye itself.</p><p><br></p><p>Common signs of corneal damage include excessive blinking, squinting, discharge, redness, swelling, rubbing at the eye, cloudiness or other unusual appearance to the corneal surface. Wounds may be visible in the corneal surface, or a history of possible eye damage such as scratches (especially from cat claws) or running through brush may exist. There may also be a history of other eye problems.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and eye tests. Often, a special dye is placed in the eye to detect corneal damage. Treatment depends on the type and severity of the injury. Mild to moderate corneal injuries are often successfully treated with medications and an Elizabethan (cone shaped) collar to prevent rubbing at the eye. Deeper, slow healing, or infected wounds can require surgical treatment, additional medications, or a visit to a veterinary ophthalmologist.</p><p><br></p><p>Prompt treatment is very important for all eye injuries. This can make the difference between successful healing or permanent vision loss.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked if there are any concerns.</p><p><br></p><p>An Elizabethan (cone shaped) collar is often necessary &amp; important to prevent further eye damage.</p><p><br></p><p>Have your pet rechecked as recommended by your veterinarian.</p><p><br></p><p>Please call the medical team if you have any questions.</p>`;

const demodecticMange = `<h2>Demodectic Mange</h2><p><br></p><p>Demodectic mange is caused by a microscopic insect, a mite, which lives under the skin around hair shafts. The mite can be present in small numbers on healthy pets without causing a problem. For several reasons, often including immune system suppression, individual pets may develop symptoms of mange that include hair loss, skin redness or swelling, and occasionally itching, crusting, and secondary bacterial infection in the affected area(s). Demodectic mange often appears around the eyes, over the top of the skull, or on the feet. Demodectic mange is not considered to be contagious under normal circumstances.</p><p><br></p><p>Mange is diagnosed by a combination of symptoms, examination findings, and laboratory testing. An important skin test, a "skin scraping," is necessary to confirm the diagnosis. Mites can be observed microscopically in the test sample. There are several treatment options. Mitaban is an FDA-approved product for the treatment of demodectic mange. It is highly effective in most cases. Side effects or reactions to Mitaban treatment are possible. Be sure to consult the medical team if you suspect one. Several other treatments are also available. Weeks or months of treatment are usually required to control mange.</p><p><br></p><p>A small percentage of dogs may relapse and require repeated treatments. Due to a hereditary predisposition, it is recommended that pets with generalized juvenile-onset demodectic mange be spayed or neutered.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Complete all prescribed medications.</p><p><br></p><p>Additional skin scrapings will be needed to confirm that the mites are gone.</p><p><br></p><p>Discontinuing therapy too soon may result in a relapse.</p><p><br></p><p>It is important to monitor your pet's progress carefully and have him/her rechecked as recommended by your veterinarian.</p><p><br></p><p>Please contact the medical team if you have any questions.</p>`;

const dentalProphy = `<h2>Dental Prophylaxis Discharge Instructions</h2><p><br></p><p>WHAT DID MY PET'S CLEANING INCLUDE?</p><p><br></p><p>Your pet received an examination of all oral structures and periodontal probing, sub-gingival (below the gum line) scaling, ultrasonic cleaning, polishing and an oral disinfecting rinse. The doctor may also have discussed other recommendations such as dental radiographs and possible extractions of diseased teeth.</p><p><br></p><p>WILL MY PET BE IN PAIN?</p><p><br></p><p>Your pet may have received an injectable pain reliever and if extractions were performed, oral nerve blocks were given to help decrease the pain. Some degree of discomfort around your pet’s mouth is expected, especially if extractions were performed. Additional pain relievers may be recommended by your pet’s veterinarian.</p><p><br></p><p>WHAT CAN I EXPECT WHEN I BRING MY PET HOME TONIGHT?</p><p><br></p><p>Your pet may seem reluctant to get up and walk this evening and may sleep more than usual. You may notice a slight cough as a result of the breathing tube in his or her throat. Most pets are able to drink small amounts of water and eat a small meal. If extractions were done, you may notice saliva tinged with blood, but this is expected unless bleeding is excessive.</p><p><br></p><p>Your pet needs to have someone home with him or her tonight.</p><p><br></p><p>SPECIAL DIET INSTRUCTIONS:</p><p><br></p><p>Wait at least 2 hours after getting home before feeding. Feed your pet only 1/4 to 1/2 the normal amount of his or her food and water or offer ice cubes. Pets may feel nauseous after surgery and may vomit if given large amounts of water or food. Tomorrow you may return to normal feeding and water unless otherwise instructed by your pet’s doctor.</p><p><br></p><p>Watch your pet for the following signs and call your local hospital / after-hours emergency clinic if seen:</p><p><br></p><p>Unresponsive/unable to stand/unable to rouse from sleep</p><p><br></p><p>Vomiting/diarrhea/excessive drooling</p><p><br></p><p>Obvious blood from the mouth or obvious pain / discomfort around the face and mouth</p><p><br></p><p>Continuous coughing or difficulty breathing</p><p><br></p><p>MISCELLANEOUS INFORMATION:</p><p><br></p><p>Refrain from offering any hard toys or treats for 7-10 days after the cleaning to allow any gum tenderness to fade.</p><p><br></p><p>Do not let your pet go up and down stairs, be near pools of water unattended or do strenuous activities while recovering from anesthesia.</p><p><br></p><p>If you notice any concerning symptoms or have any questions or concerns about the health of your pet, please contact your doctor or your local emergency clinic after hours.</p>`;

const dentalTartar = `<h2>Dental Tartar, Gingivitis, Periodontal Disease</h2><p><br></p><p>Dental calculus is composed of various mineral salts, organic material, bacteria, saliva, and food particles. In the early stages of accumulation, the material is soft and is termed dental plaque. Plaque can be removed by brushing daily. As time passes, the plaque becomes hardened and adheres to the teeth. At this point, the plaque becomes a dental calculus. Calculus (plural, calculi) builds up above and below the gum line. Calculus is visible as a yellow to brown material on the tooth surface, usually near the gum, and cannot be removed by brushing.</p><p><br></p><p>Gingivitis is the result of continual accumulation of dental calculi, causing pressure, inflammation, and infection of the gums (also called gingival tissue, or the gingival line). Gingival tissue may appear swollen, reddened, and may be painful. At this stage, there is no loss of any underlying supportive structures of the teeth.</p><p><br></p><p>Periodontal disease is the result of progressive gingivitis and represents damage to or loss of the tissues that help support the teeth. These tissues include the gingiva, ligaments, and underlying bone. Radiographs (x-rays) may be necessary to determine the extent of the underlying disease. There are 4 stages of periodontal disease, with stage 4 being the most severe. Refer to the Dental Care Client Brochure for more details.</p><p><br></p><p>It is currently known that some of the internal diseases of dogs and cats may be caused by diseased teeth and gums. Bacteria can travel through the blood stream to vital organs like the heart, liver, lungs, and kidneys and cause damage. The American Veterinary Dental College recommends an annual veterinary dental cleaning, along with daily home care. Good home dental care, including tooth brushing, can reduce the formation of dental calculus and help slow the progression of periodontal disease.</p><p><br></p><p>Treats that help control the development of dental calculus, specific diets for dental health, and certain chew toys can also be helpful. Look for the Veterinary Oral Health Council (VOHC) seal on dental products. The VOHC group independently evaluates products and identifies those that help control the development of dental calculi.</p><p><br></p><p>Please contact your {hospital name} team to ask questions regarding your pet’s dental health. When recommended, please call to schedule your pet's dental cleaning.</p><p><br></p><p>Refer to the following for additional information:</p><p><br></p><p>{Insert links here}</p>`;

const diabetesMellitus = `<h2>Diabetes Mellitus</h2><p><br></p><p>Diabetes Mellitus is a disease that interferes with the body's use of blood sugar, or glucose. Glucose is the body's fuel and is required for life. Normally, insulin allows the body to absorb and use glucose derived from food. Insulin is a hormone produced by special cells in the pancreas. Diabetics often need to receive supplemental insulin in the form of injections to properly absorb and utilize glucose.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and blood tests. Treatment usually involves insulin injections, special food, and strict feeding schedules. Without insulin replacement, more serious changes occur within the body that can lead to blindness, liver failure, diabetic coma and death. Control of blood sugar levels is the prime objective in the treatment of Diabetes Mellitus. Diabetic Pets need routine blood sugar level checks and internal organ monitoring.</p><p><br></p><p>As with humans, this is a condition that needs to be monitored and treated in the long term. It is important now to understand the unique needs of your pet and the signs of diabetes. In addition, giving insulin injections and regularly testing your pet's blood sugar levels are important components to keeping your pet’s diabetes regulated. Your veterinarian may discuss the option of home testing when and if it is appropriate for you and your pet. It is important to always contact your veterinarian before changing your pet's insulin dosage. If you notice any signs of low blood sugar (confusion, staggering, significant lethargy, vomiting, seizures) please contact your veterinarian or an emergency hospital immediately.</p><p><br></p><p>Additional information about diabetes in pets and home monitoring, including informational videos can be found using the web address below.</p><p><br></p><p>{insert link here}</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as directed.</p><p><br></p><p>Insulin administration schedules should be carefully followed for the best results.</p><p><br></p><p>If a special diet has been prescribed for your pet to help manage blood glucose fluctuations, it is important to follow the strict feeding schedules as outlined by your doctor. Ensure that your pet has access to fresh water at all times.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact the hospital with any questions.</p><p><br></p><p>Monitor your pet closely for any change in water intake or urination habits. Please call the hospital if changes occur.</p><p><br></p><p>If your pet becomes depressed, has a change in appetite or attitude, or vomits, have him or her rechecked immediately.</p><p><br></p><p>If you have any additional questions, please contact your hospital veterinarian.</p>`;

const earCleaning = `<h2>Ear Cleaning &amp; Medicating</h2><p><br></p><p>Below you will find basic ear cleaning and medicating tips for your pet. These are general instructions. If your pet's doctor has given you specific instructions that differ from these, please follow those specific instructions.</p><p><br></p><p>Ear Cleaning:</p><p><br></p><p>The ear is very sensitive and should always be handled gently.</p><p><br></p><ol><li>Gently grasp the ear tip and pull it straight up and slightly away from the pet's head (toward you). Apply an appropriate cleaning solution into the ear canal opening. Inappropriate liquids can cause irritation and damage to the delicate ear structures. Your pet's doctor will likely prescribe an ear cleaner designed for use in pets. Use almost enough cleaner to fill up the canal. Some of the cleaning solution can be gently rubbed on the earflap if needed.</li><li>Gently massage the ear at its base. You should hear the cleaner "squish" in the ear as you massage. Continue for 30-90 seconds. Then, wipe up excess solution and loose debris from the earflap and ear canal entrance with a dry cotton ball or paper towel. You may also allow your pet to shake its head to bring up more solution and debris from the canals. Gently wipe this away with a cotton ball. You might want to perform ear cleaning in the backyard or garage as debris and cleaner may be shaken out of your pet's ears onto surrounding surfaces. The goal of ear cleaning is to remove the debris deep in the ear canal. This allows ear medications to work more effectively.</li><li>Repeat the cleaning procedure as directed by your pet's doctor. Any ear medications should be placed in the ear after cleaning, not before. It is usually best to wait 20-30 minutes between ear cleaning and application of medication.</li></ol><p><br></p><p>Medication Application:</p><p><br></p><ol><li>Gently grasp the ear tip and pull it straight up and slightly away from the pet's head (toward you). Apply the prescribed amount of medication into the ear canal opening, allowing it to run down into the canal.</li><li>After placing medication in the ear, massage gently as directed above for the cleaning procedure. If only a small amount of medication is used, you may not hear a "squish" as you would during cleaning.</li><li>If the inner ear flap is involved, place a small amount (about 1/3 of the prescribed amount of medication) on the earflap. Spread the medication over the affected area (ideally with a gloved finger or a cotton ball). The entire affected should be covered with a thin film of medication.</li></ol><p><br></p><p>Bathing During Treatment:</p><p><br></p><p>If your pet needs bathing during the ear treatment period, plug the opening of the ear canals with dry cotton balls to prevent water from running into the canals.</p><p><br></p><p>Rechecks:</p><p><br></p><p>Be sure to have your pet rechecked as directed by your veterinarian. Rechecks are very important to monitor your pet's progress, adjust medication and cleaning schedules and to help insure the best possible outcome for your pet's individual needs.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Follow all home care or post-surgical instructions.</p><p><br></p><p>Don't allow your pet's ears to get wet during bathing or swimming. This can worsen infection.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact the medical team with any questions.</p>`;

const earMites = `<h2>Ear Mites</h2><p><br></p><p>Ear mites are microscopic parasites that live in the ear canals of infected dogs and cats. These mites are highly contagious and can be found in whole litters of kittens or, less frequently, in puppies. Adult pets can also be infected.</p><p><br></p><p>A dark, crusty material is usually found in the ear canal of infected pets. Head shaking and scratching at the ears is common. Often, a secondary bacterial infection is present. Untreated infections can lead to ear canal or eardrum damage. Diagnosis is based on symptoms and laboratory tests. It is often necessary to examine ear discharge microscopically to confirm the presence of mites. Treatment consists of one of several topical ear medications and/or injections to kill the parasites. With some medications, routine ear cleanings may be needed.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Depending on which treatment is used, the ears may need to be cleaned prior to and during treatment- ask your pet's doctor.</p><p><br></p><p>With some medications, it may be necessary to treat the ears for at least 3 weeks to kill mites as they hatch- ask your pet's doctor.</p><p><br></p><p>Please complete all medications as prescribed.</p><p><br></p><p>It is important for us to check your pet's progress in 10 to 14 days.</p><p><br></p><p>Please contact the medical team if you have any questions.</p>`;

const ectropion = `<h2>Ectropion, Entropion</h2><p><br></p><p>Ectropion and entropion are abnormalities of the eyelids. Ectropion is a rolling out, and entropion is a rolling in of the eyelid. The abnormalities can be inherited, congenital, or acquired from disease or injury. With ectropion (rolling out), sensitive structures of the eye are more exposed to injury or irritants such as dust and other foreign matter. This may lead to more serious eye problems. In severe or long-standing cases of entropion (rolling in), the eye lashes can cause pain, permanent damage, and vision loss by rubbing on the cornea, or front, of the eyeball.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and eye tests. Treatment may be medical or surgical, depending on the type, cause, and severity of eyelid abnormality. Often, ectropion and entropion can only be corrected by surgical means.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as directed.</p><p><br></p><p>Follow all post-surgical or aftercare instructions. An Elizabethan (cone shaped) collar is usually needed after surgery.</p><p><br></p><p>DO NOT allow your pet to rub or paw at the eye - this will damage sensitive eye tissue.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact the medical team with any questions.</p>`;

const epilepsy = `<h2>Epilepsy &amp; Seizures</h2><p><br></p><p>Abnormalities in the Central Nervous System (CNS), or brain, can cause seizures and seizure like episodes. The abnormalities can be caused by epilepsy, brain tumors, head trauma, toxins, cancer, compromised blood flow, infections, and poorly functioning internal organs that cause build up or body wastes in the blood.</p><p><br></p><p>Clinical signs of seizure type activity can range greatly in severity. Mild episodes may be barely noticeable and consist only of staring ("star gazing") or repetitive jaw movements (chewing gum seizures). Severe seizure activity can range up to extremely violent thrashing and complete loss of body control and awareness.</p><p><br></p><p>Diagnosis is based on symptoms, medical history, examination findings, blood and urine tests, and sometimes X-rays or other imaging tests. Treatment and prognosis vary greatly depending on the underlying disease.</p><p><br></p><p>Epilepsy is a disturbance in normal brain function that causes recurrent seizures and/or behavioral changes. There are no specific tests for epilepsy. Diagnosis is based on age, breed, and tests to rule out other causes for seizures. In many cases, epilepsy can be adequately treated by anti-convulsant medication. These pets will need to have periodic blood tests to check the level of anti-convulsant drug in their systems. The health of internal organs will need to be monitored.</p><p><br></p><p>*** IMPORTANT POINTS IN EPILEPSY TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Accurate dosing schedules are very important to help control seizure activity.</p><p><br></p><p>It is helpful for your pet's doctor to track any seizure activity in a "seizure log".</p><p><br></p><p>Contact your veterinarian whenever your pet has a seizure.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as recommended by your veterinarian.</p><p><br></p><p>Please contact the medical team with any questions.</p>`;

const euthanasia = `<h2>Euthanasia</h2><p><br></p><p>Please accept our condolences on the loss of your pet.</p><p><br></p><p>We bring pets into our homes, and they very quickly become cherished family members that we love and care for beyond measure. They can never be replaced and in our hearts, they are never forgotten. We are honored to have been able to help provide medical care for your pet.</p>`;

const felineImmunodeficiencyVirus = `<h2>Feline Immunodeficiency Virus (FIV)</h2><p><br></p><p>Feline immunodeficiency virus (FIV) is a type of virus called a retrovirus that infects domestic cats. It is in the same family as feline leukemia virus (FeLV) and human immunodeficiency virus (HIV, the virus that causes AIDS). The virus attacks the immune system, and as a result, the cat is unable to fight off various infections and other diseases. Retroviruses are species specific. This means a feline retrovirus like FIV will only infect cats; a human retrovirus such as HIV will only infect humans.</p><p><br></p><p>The disease is transmitted by infected saliva or blood, usually through bite wounds. Mother cats, or queens, who become infected during pregnancy can transmit the virus to kittens before birth or immediately after birth through colostrum (first milk).</p><p><br></p><p>Initial symptoms:</p><p><br></p><ul><li>Acute phase— may be undetected and include mild fever, depression, GI dysfunction, severe inflammation of the gums, and enlarged lymph nodes.</li></ul><p><br></p><p>Followed by:</p><p><br></p><ul><li>Asymptomatic phase- no clinical signs, variable in duration.</li></ul><p><br></p><p>Progresses to:</p><p><br></p><ul><li>Terminal phase— may include weight loss, persistent diarrhea, severe dental disease, severe inflammation of the gums, chronic respiratory disease, ocular disease, enlarged lymph nodes, chronic skin disease and cancers.</li></ul><p><br></p><p>Cats that are diagnosed with FIV should have a confirmation test such as a Western blot or a FIV DNA (PCR) test to verify the disease, since current in-house testing (IDEXX SNAP ELISA antibody test) cannot distinguish between a naturally infected cat and a cat that has been vaccinated for FIV.</p><p><br></p><p>All cats living in the same household as an FIV infected cat, any cat that goes outside or lives with cats that go outside, and any new cats entering the household should be tested for FIV as well as feline leukemia virus (FeLV) annually. Please discuss with your {hospital name} veterinarian whether the FIV vaccine is right for your cat.</p><p><br></p><p>There is no cure for FIV but with early detection and proper treatment of illnesses your cat can live for many years. Keep in mind that cats that are infected with the FIV virus should be kept indoors to prevent disease transmission. In addition, positive FIV cats will also need to be seen by a veterinarian more frequently for routine blood work and urinalysis to monitor the disease progression.</p><p><br></p><p>**IMPORTANT POINTS IN TREATMENT**</p><p><br></p><p>Use all medications as prescribed by your {hospital name} veterinarian.</p><p><br></p><p>Monitor your pets' progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const felineUpperRespiratoryVirus = `<h2>Feline Upper Respiratory Virus</h2><p><br></p><p>Feline viral upper respiratory tract disease is caused by Feline Herpes Virus and/or Feline Calicivirus infection. A cat can become ill at any age, but the disease most often attacks kittens or weakened individuals. Kittens may be exposed to the viruses from their mother, even if she has no symptoms of illness. The viruses may also be spread by transmission from cat to cat by sneezing, coughing, mutual grooming, or contact through clothing, hands, bedding, or food bowls.</p><p><br></p><p>Common signs of the infection include depression, fever, coughing, sneezing, discharge from the eyes and nose, and swelling or redness in the tissues of the eye (conjunctivitis). Occasionally, the disease can spread to the lungs and cause pneumonia. In some cats, ulcers may appear in the mouth or on the cornea of the eye.</p><p><br></p><p>Diagnosis is usually based on symptoms and age or environment of the pet. Treatment is aimed at the symptoms of the disease. Antibiotics are often used to reduce the chance for secondary bacterial infections in the respiratory tract or eyes. Fluid therapy may be needed for pets that become dehydrated or feverish. Good nursing care is essential to a speedy recovery. Often, these ill cats will not eat or drink well on their own and may not groom themselves as usual. Extra nutritional support may be necessary. Most cats recover with good nursing care and treatment. However, more serious complications are possible, especially if underlying diseases are present.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked if there are any concerns.</p><p><br></p><p>Separate any ill pets from others and use separate feeding, bedding, and grooming items. Wash your hands after handling it to reduce the chance of disease transmission.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const fleasAndFlea = `<h2>Fleas &amp; Flea Allergy Dermatitis</h2><p><br></p><p>Fleas are small, brown or black, wingless, rapid-moving insects that feed on blood by biting pets and, occasionally, people. They can cause anemia, allergies, and severe itching. Intense itching and chewing on the skin can lead to damage and secondary bacterial infection. Significant numbers of fleas can cause life-threatening blood loss to young, elderly, or debilitated pets. If a pet ingests a flea during grooming, he or she could become infected with immature tapeworms that can be carried by fleas.</p><p><br></p><p>The adult flea has a life span of up to one year. Its life cycle consists of egg, larva, nymph, pupa and adult. Females may lay dozens of eggs daily which can hatch quickly into larvae or remain in the environment for months. Flea eggs are resistant to many cleaners and flea control products. Larvae develop into pupae that can remain dormant for extended periods in the right conditions before emerging as adults.</p><p><br></p><p>Complete flea control consists of treating both the environment (including house and yard) and the pet. Ideally, fleas should be killed before they feed on the pet to reduce the potential for skin allergies and other health problems.</p><p><br></p><p>Flea Allergy Dermatitis</p><p><br></p><p>Flea allergy dermatitis is inflammation of the skin caused by an allergic reaction to flea saliva. Each adult flea bites many times per day. Due to intense itching, extensive skin damage may result from the pet's biting, licking and scratching. Flea allergy dermatitis can range from mild itching to severe, intensely painful inflammation. Normal skin bacteria may opportunistically invade the damaged skin and cause infection as well.</p><p><br></p><p>Diagnosis is based on clinical signs, examination findings, evidence of fleas, response to treatment, and sometimes skin or blood tests. Flea control is an essential part of treatment. Antibiotics, anti-inflammatory medications, topical medications, or shampoos may be necessary. Although flea bite allergy can be treated, it will be a recurring problem unless consistent flea control measures are taken.</p><p><br></p><p>*** IMPORTANT POINTS IN FLEA CONTROL ***</p><p><br></p><p>Provide your pet with veterinarian-recommended flea control all year round.</p><p><br></p><p>Be sure to treat the environment as well as the pet. Begin a comprehensive flea control program that includes treatment of the house, yard, and any area that your pet visits.</p><p><br></p><p>Use all products as directed. Always read the labels.</p><p><br></p><p>All dogs and cats in the household must be treated to give the best chance for proper flea control.</p><p><br></p><p>Have your pet rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const giardia = `<h2>Giardia</h2><p><br></p><p>Giardia is a microscopic parasite that can infect most mammals, including humans. The parasite invades cells lining the intestinal tract, causing bowel irritation and damage. There, the parasites reproduce and shed into the stool to pass out of the body. This stage of the parasite is very hearty and can remain infective in the environment for long periods of time. Infection occurs when parasites are ingested in contaminated water, stool, plant material, or food. Even licking a few drops of contaminated water, or a few parasites off of the paws or coat, can potentially cause infection.</p><p><br></p><p>Pets infected with Giardia may or may not show obvious symptoms. Pets that do not appear ill can still shed the parasite in their stool, acting as a source of infection for other pets or human family members. Common problems seen during infection may include decreased energy, weight loss, vomiting, or diarrhea. Diagnosis can be difficult. Multiple microscopic stool examinations or other laboratory tests are usually necessary. Several medications exist to treat infection. Often, more than one course of therapy is needed to eliminate Giardia.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>All infected pets in the household should be treated.</p><p><br></p><p>All stools should be cleaned up at least once daily during the treatment period and regularly thereafter.</p><p><br></p><p>Kennels and dog runs should be disinfected with a diluted bleach solution and rinsed well, daily, during the treatment period.</p><p><br></p><p>One or more stool samples should be examined after treatment to be sure your pet is parasite free.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const heatwormDisease = `<h2>Heartworm Disease &amp; Prevention</h2><p><br></p><p>A mosquito-borne parasite called Dirofilaria immitis causes canine heartworm disease. When an infected mosquito bites a pet, microscopic heartworm larvae can enter the skin and tissues. The larvae migrate in multiple body tissues until they reach the large vessels of the heart and lungs. These parasites then grow up to 12 inches long in the heart and surrounding blood vessels. Heartworm disease can cause heart, lung, kidney, and liver damage. Luckily, this is a preventable disease. Dogs are at most risk for heartworm infection. However, cats, ferrets, wild canines (foxes, etc.), humans, and several other mammals can be infected.</p><p><br></p><p>Often, infected pets may show no symptoms until severe tissue damage has already occurred. These signs include coughing, respiratory problems, lack of energy, exercise intolerance, weight loss, fainting, coughing up blood, or sudden respiratory distress and death. Diagnosis is based on signs, history, blood and other laboratory tests, and sometimes X-rays. Treatment usually consists of medications to kill the adult parasites first and later the larval stages. In some cases, pets may have serious or potentially fatal reactions to treatment medications. Also, the dead or dying adult worms may flow into the lungs, causing life threatening blood vessel blockages.</p><p><br></p><p>Prevention is the best, easiest, safest, and least expensive medicine. After testing to rule out a pre-existing infection, heartworm preventative will keep pet's parasite free which may be a monthly oral medication, or an injection given by your veterinarian that lasts 6 months. Many heartworm preventives also kill some intestinal worms that can cause serious disease.</p><p><br></p><p>*** IMPORTANT POINTS IN PREVENTION and TREATMENT ***</p><p><br></p><p>Have your pet checked for heartworm disease yearly.</p><p><br></p><p>Use heartworm preventives or other medications as directed by your veterinarian.</p><p><br></p><p>If your pet has been diagnosed with heartworm disease, be sure to discuss treatment and prognosis with your veterinarian immediately.</p><p><br></p><p>Monitor your pet carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const heartwormTesting = `<h2>Heartworm Testing (4DX)</h2><p><br></p><p>Your pet received a heartworm test today called the SNAP® 4Dx™ Test. This test is very sensitive and allows your doctor to simultaneously screen for heartworm disease, Ehrlichia, Anaplasma, and Lyme disease. Mosquitoes transmit heartworm disease to pets while Ehrlichia, Anaplasma, and Lyme disease are transmitted by ticks. If you have any questions about this test, please contact your doctor.</p>`;

const hipDysplasia = `<h2>Hip Dysplasia</h2><p><br></p><p>Hip Dysplasia is a defect of the hip joint found most often in giant and large breed dogs. The normal hip is a ball and socket type joint. The socket is part of the pelvis. The ball is at the upper end, or head, of the femur (thigh) bone. With dysplasia, the normally rounded head of the femur is flattened and fits poorly into the socket and/or the socket may be abnormally shallow.</p><p><br></p><p>Common signs include hind leg lameness, swaying or staggering, discomfort upon rising, and reluctance to run and jump. Excess body weight or concurrent injuries can worsen existing hip dysplasia. The disease ranges from mild and only slightly uncomfortable, to severe and chronically painful. Cases of extensive disease can cause progressive, crippling arthritis.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings and X-rays. Treatment is based on the severity of the disease. Maintenance of proper body weight is important for all dysplastic pets. Weight control and anti-inflammatory medications may be adequate for mild to moderate cases. A modified exercise plan may be helpful as well. Serious cases can require surgery. Although a complete cure is unlikely, proper treatment can give most dysplastic pets a useful and comfortable life.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Be sure to discuss the options and outlook for your pet with your veterinarian.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const hyperthyroidism = `<h2>Hyperthyroidism</h2><p><br></p><p>The thyroid gland produces essential hormones that are involved in the regulation of many vital body functions. Tumors of the thyroid gland can cause over production of these hormones, or hyperthyroidism. Hyperthyroidism usually develops gradually and can be difficult to notice in the early stages. In cats, the thyroid tumors are usually benign and do not spread to other organs. In dogs, thyroid tumors have much more potential to be malignant and spread throughout the body.</p><p><br></p><p>Pets may exhibit one or many of these common signs including: weight loss, increased appetite (can increase greatly), increased water intake, frequent stools, restlessness, crying, and panting. Diagnosis is based on clinical signs, examination findings, and blood work that includes testing the level of thyroid hormone present. Treatment varies depending on tumor type, species, and stage of disease.</p><p><br></p><p>Common treatments for feline hyperthyroidism include:</p><p><br></p><p>Administration of a drug called "methimazole". This medication can bind up excess hormones and control symptoms of the disease. Usually, lifelong treatment is necessary.</p><p><br></p><p>Irradiation (radiation treatment) of thyroid tumor tissue. This has a high success rate and can eliminate the disease.</p><p><br></p><p>Surgical removal of the thyroid tumor tissue. This can completely eliminate the disease.</p><p><br></p><p>For canine hyperthyroidism, surgical removal of the thyroid tumor is usually recommended, as these tumors have much more potential to be malignant. Dogs may receive methimazole or radiation treatment as well.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Your pet will need thyroid hormone level checks and other blood tests as directed by your veterinarian.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked if you have any concerns.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const hypothyroidism = `<h2>Hypothyroidism</h2><p><br></p><p>The thyroid gland produces essential hormones that are involved in the regulation of many vital body functions. Hypothyroid pets produce too little of these important hormones. Hypothyroidism usually develops gradually and can easily be mistaken as laziness or "slowing down" from age or obesity. This disease is rare in cats.</p><p><br></p><p>Pets may exhibit one or many common signs including weight gain, reduced activity, decreased energy, heat seeking behavior, dry and flaky skin, chronic skin and ear infections, hair loss, darkening of skin pigmentation, or a droopy or sad facial expression.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and blood work that includes testing the level of thyroid hormone present. Treatment usually consists of medication that replaces the missing thyroid hormone. After placing a pet on replacement hormone, the thyroid level must be checked one to two months later, after any medication adjustments, and occasionally thereafter to ensure proper dosing. Concurrent problems, such as skin or ear infections, will need appropriate treatment as well. Many pets on replacement hormones gain energy, begin to lose excess weight, and have improvements in skin or ear problems. They often appear to feel better in general.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Your pet will need thyroid hormone level checks as directed by your veterinarian.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked if you have any concerns.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const insulin = `<h2>Insulin</h2><p><br></p><p>This summary contains important information about insulin. You should read this information and review it each time the prescription is filled. This sheet is provided as a summary and does not take the place of instructions from your veterinarian. Talk to your veterinarian if you do not understand any of this information or if you want to know more about insulin.</p><p><br></p><p>Insulin is an injectable hormone used to help control blood glucose (sugar) levels in pets with diabetes mellitus. It is administered as an injection, and it is very important to use the appropriately sized syringe (use U40 syringes to administer U40 insulin; use U100 syringes to administer U100 insulin).</p><p><br></p><p>YOUR PET SHOULD NOT BE GIVEN INSULIN IF HE/SHE HAS A KNOWN SENSITIVITY / ALLERGY TO INGREDIENTS IN THIS MEDICATION OR ANY RELATED COMPOUNDS.</p><p><br></p><p>HOW AND WHEN DO I GIVE THE MEDICINE TO MY PET?</p><p><br></p><ul><li>Always follow the doctor’s directions. Give the medicine as directed. Use it only as prescribed. See the medicine label for specific instructions.</li><li>Store insulin in the refrigerator in a consistent place (it is typically recommended to use a shelf rather than the door), unless otherwise directed. Follow directions for mixing prior to injection.</li></ul><p><br></p><p>WHAT SIDE EFFECTS MAY OCCUR?</p><p><br></p><p>Side effects are primarily related to inadvertent effects on blood glucose levels: excessive thirst and urination, increased appetite, and weight loss may be seen with increased blood glucose levels. Weakness, lethargy, collapse, and depressed neurologic state may be seen with low blood glucose levels.</p><p><br></p><p>WHEN SHOULD I CALL MY VETERINARIAN?</p><p><br></p><p>If your pet does not eat or drink at any time during the administration of this drug, please call your veterinarian. Call before stopping the medicine if any side effects occur or if the symptoms persist. Schedule follow-up visits as directed by your veterinarian. Your pet may require blood work and/or other diagnostic tests to check his or her response to the plan of care.</p><p><br></p><p>WARNINGS:</p><p><br></p><p>As with any product, consult your veterinarian before using this product on debilitated, aged, pregnant or nursing pets. If your pet is on any other medication, consult your veterinarian before using this or any other product. Tell your veterinarian about any medications or supplements you are giving, or plan to give your pet. Tell your veterinarian if your pet is pregnant, nursing, or if you plan to breed your pet.</p><p><br></p><p>PLEASE NOTE:</p><p><br></p><p>Call for a refill (if needed) 4-5 days before the last dose. Keep this and all medications out of the reach of children and other pets. Contact your physician immediately with any concerns of human exposure/ingestion.</p><p><br></p><p>References: Plumb’s Veterinary Drug Handbook, 8th edition</p><p><br></p><p>U.S. National Library of Medicine, National Institutes of Health</p>`;

const kennelCough = `<h2>Kennel Cough, Bordetella</h2><p><br></p><p>Bordetella bronchiseptica is a bacterial agent that, along with several viruses, contributes to Canine Infectious Tracheobronchitis, or "Kennel Cough" disease. This infection is very contagious between dogs and can be transmitted through the air, especially in areas where there are many pets in close proximity, hence the name "Kennel Cough". Cats can also contract Bordetella.</p><p><br></p><p>Tracheobronchitis is an infection of the trachea (windpipe) and lower respiratory passages, or bronchi. The disease may also affect the upper respiratory tract, causing a nasal or sinus infection. Occasionally, this disease can lead to pneumonia, especially in weakened or elderly pets.</p><p><br></p><p>Common signs include coughing, or a cough/gag/retch that may produce a small amount of saliva. Normal barking sounds may also be changed. The cough can be mild and occasional to constant, deep, and hacking. Diagnosis is based on history, symptoms, examination findings, response to treatment, and sometimes blood tests or x-rays.</p><p><br></p><p>Treatment usually consists of antibiotic therapy. Cough suppressants, medications to expand the airways, and anti-inflammatories may be needed as well.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Separate any ill pets from others. Use separate feeding, bedding, and grooming items. Wash your hands after handling it to reduce the chance of disease transmission.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const lickGranuloma = `<h2>Lick Granuloma (Acral Lick Dermatitis)</h2><p><br></p><p>A lick granuloma is an area of irritated, thickened, and often bald skin resulting from repeated licking and/or chewing. Initially, there is only a small area of hair loss. With continued licking, the skin surface can become raw and infected. A mass of thickened skin may develop. The lower legs are the most common sites to develop lick granulomas.</p><p><br></p><p>There are numerous causes for lick granuloma formation, which include behavioral factors (boredom, stress), skin conditions (allergies, infection, irritation, and fleas), and undiagnosed pain (joint or soft tissue pain, arthritis). Diagnosis is based on clinical signs, examination findings, history, response to treatment, skin or blood tests, and sometimes X-rays.</p><p><br></p><p>Treatment varies depending on severity and duration of the problem. In the early stages, topical medication and elimination of predisposing factors may control lick granulomas. Often, treatment will include some means of preventing additional licking at the site by wrapping the area, application of lick inhibiting substances, and/or an Elizabethan collar. Antibiotics and behavior-modifying medications may be prescribed as well. Environmental enrichment can be helpful. No single treatment is effective for every pet. Granulomas may be chronic or recurrent for some pets. Monitoring is important.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as directed.</p><p><br></p><p>Follow all wrap or wound care instructions.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const meloxicam = `<h2>Meloxicam</h2><p><br></p><p>Your pet has been prescribed Meloxicam, a non-steroidal, anti-inflammatory drug (NSAID). This medication is intended to help with pain control and the treatment of inflammation associated with osteoarthritis, or as determined by your veterinarian.</p><p><br></p><p>-How and when do I give the medicine to my pet?</p><p><br></p><p>Always follow the doctor's directions. Give the medicine as directed. Use it only as prescribed. Store the medication at room temperature. For small dogs and cats, administer drops on food ONLY - do not give directly into the mouth. Refer to your doctor's directions for specific dosing.</p><p><br></p><p>-What side effects may occur?</p><p><br></p><p>Side effects may include gastrointestinal related effects such as vomiting; diarrhea or soft stool; weight loss; abdominal pain; lethargy or loss of appetite. You may also observe pruritis (intense itching). On rare occasions renal (kidney) toxicity has been documented.</p><p><br></p><p>-Warnings:</p><p><br></p><p>This medication should not be given to patients with bleeding disorders, impaired renal, hepatic (liver) or cardiac (heart) function, or that are taking other NSAID medications. If your pet is already taking medication, please contact your veterinarian and inquire whether it is safe to give that medication along with Meloxicam.</p><p><br></p><p>As with any product, consult your veterinarian before using this product on debilitated, aged, pregnant or nursing pets. If your pet is on any other medication, consult your veterinarian before using this or any other product.</p><p><br></p><p>Keep this and all medications out of the reach of children and other pets.</p><p><br></p><p>-When should I call my veterinarian?</p><p><br></p><p>If your pet does not eat or drink at any time during the administration of this drug, please call your veterinarian. Call before stopping the medicine if any side effects occur or if the symptoms persist. Schedule follow-up visits as directed by your veterinarian. Your pet may require blood work and/or other diagnostic tests to check his or her response to the plan of care.</p>`;

const noSorb = `<h2>NoSorb</h2><p><br></p><p>Your veterinarian has recommended NoSorb® to aid in the collection of urine samples for your pet. The following guide provides you with general information about the product.</p><p><br></p><p>Why do I need this product?</p><p><br></p><p>Urinalysis is an important diagnostic tool, and at times it can be difficult to obtain a sample during your pet’s visit to the hospital. A urinalysis may help your doctor identify urinary tract disease, monitor kidney function, assess hydration levels, help manage diabetes, or may be a part of a routine semi-annual comprehensive exam. NoSorb makes it convenient for you to collect a urine sample at home, using your litter box.</p><p><br></p><p>How do I use this product?</p><p><br></p><ol><li>Completely empty your current litter box.</li><li>Clean the litter box with dish soap, rinse completely.</li><li>Once dry, pour all NoSorb (black pellets) into the litter box, saving the plastic cup container.</li><li>Place the litter box back in its familiar place.</li><li>Monitor the litter box frequently until your pet urinates in the litter box.</li><li>Collect urine as soon as possible by transferring it (without the NoSorb) in the plastic cup container.</li><li>Write your pet's information on the label of the plastic cup lid.</li><li>Drop the plastic cup and contents off at your hospital as soon as possible, keeping the sample refrigerated until you can. Samples that are older than 12 hours should be discarded.</li></ol><p><br></p><p>Please note:</p><p><br></p><p>The quality of the results of the test may be affected if a sample is left in a litter box or unrefrigerated for more than 60 minutes. If this is the case, please inform your veterinarian to ensure that a repeat sample is not needed.</p><p><br></p><p>Follow any additional directions from your veterinarian.</p><p><br></p><p>Please call your veterinarian with any concerns or if any additional guidance is needed.</p>`;

const nsaids = `<h2>NSAIDS</h2><p><br></p><p>Non-Steroidal Anti-Inflammatory Drugs</p><p><br></p><p>This reference sheet contains important information about a medication that was prescribed for your pet. You should read this before starting your pet on the medication and whenever the prescription is refilled.</p><p><br></p><p>What is an NSAID?</p><p><br></p><p>NSAIDs (non-steroidal anti-inflammatory drugs) are designed to reduce pain and inflammation for many pet problems. These medications are commonly used for arthritis, injuries, and post-surgical pain. Response to this group of medications is variable, but many pets experience significant relief of discomfort. Most of these medications come in tablet form and many are available by prescription only.</p><p><br></p><p>Common veterinary prescription NSAIDs include:</p><p><br></p><ul><li>Rimadyl (carprofen)</li><li>Etogesic (etodolac)</li><li>Phenylbutazone</li><li>Meclofenamic Acid</li><li>Ketoprofen (liquid)</li></ul><p><br></p><p>Who should NOT take NSAIDs?</p><p><br></p><ul><li>Pets that have had any allergic reaction to aspirin or any other NSAID.</li><li>Pets that are receiving any other NSAIDs (including aspirin) or steroids (cortisone, prednisone, dexamethasone, etc.).</li><li>Be sure to tell your pet's doctor if your pet has ever had:</li><li>Any side effects or problems from any NSAID.</li><li>A sensitive digestive system (food allergies, vomiting, diarrhea, gastric ulcers, etc.)</li><li>Liver or kidney disease.</li><li>Any bleeding disorder (hemophilia, low platelet or red blood cell count, Von Willebrand's disease, etc.).</li><li>Any other health problems or allergies.</li></ul><p><br></p><p>Also tell your pet's doctor about:</p><p><br></p><ul><li>Any medications your pet is receiving or will be receiving while taking the NSAID - even over the counter items.</li><li>If your pet is pregnant, nursing, or if you are planning to breed your pet</li></ul><p><br></p><p>Your pet's doctor may need to perform blood, urine, or other tests to rule out underlying medical problems before prescribing an NSAID. For your pet's safety, Banfield requires regular blood tests to check internal organ health for the ongoing use of some NSAIDs.</p><p><br></p><p>What side effects can NSAIDs cause?</p><p><br></p><p>Although NSAIDs are used safely and effectively for many pets every day, there is a potential for side effects, just as with any other medication. Serious side effects can occur with little or no warning, and in rare cases, lead to death.</p><p><br></p><p>The most common side effects are vomiting, diarrhea, or other digestive upsets. If your pet experiences these signs, stop using the medication and call your veterinarian promptly.</p><p><br></p><p>If you notice lethargy, decreased appetite or water intake, rashes, yellowing of the skin, gums, or whites of the eyes, or other serious medical problems, stop using the medication and call your veterinarian immediately. Consult your veterinarian for any other questions.</p>`;

const otitisExterna = `<h2>Otitis Externa</h2><p><br></p><p>Otitis externa is an inflammation or infection of the outer ear canal and may also involve the ear flap. There are numerous causes for otitis including bacteria, yeast, ear mites, excessive wax, hair and debris within the canal, allergies, hormonal imbalances, pre-existing ear canal or flap damage, long or heavy ear flaps, and frequent exposure to moisture.</p><p><br></p><p>Common signs include head and ear pain, scratching or rubbing at the ears, shaking of the head, or discharge, odor, redness, and swelling of the ears. Diagnosis is based on signs, examination findings, and laboratory tests. In painful patients, sedation or anesthesia and deep ear cleaning may be necessary to examine the ear and remove foreign bodies, hair, or infected discharge. Treatment varies based on severity and duration of infection. Topical ear medications and cleaning solutions are usually prescribed. Antibiotics, antifungals, and/or anti-inflammatory drugs are sometimes needed. Any underlying problems (removal of foreign bodies, damaged or scarred tissue, control of concurrent skin problems) must be corrected for successful resolution. Surgery may be needed in extreme, chronic cases.</p><p><br></p><p>An extended treatment period may be necessary for significant infections. Good home care can make the difference between resolution or chronic pain and infection for affected pets.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Follow all home care or post-surgical instructions.</p><p><br></p><p>Don't allow your pet's ears to get wet during bathing or swimming. This can worsen infection.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const otitisInterna = `<h2>Otitis Interna, Otitis Media</h2><p><br></p><p>The ear consists of three parts: the external ear canal (from the outside up to the eardrum), the middle ear (the space behind the eardrum), and inner ear (the area that transmits information to the brain to be interpreted as sound). Otitis media is infection or inflammation of the middle ear. Otitis interna is an infection or inflammation of the inner ear. These diseases are usually extensions of external ear infections, or otitis externa, through a ruptured eardrum. These infections can easily cause permanent hearing loss, or loss of balance in extreme cases.</p><p><br></p><p>Common signs include history of external ear infections, head and ear pain, discharge, odor, redness or swelling of the ear canals. There may be head shaking, scratching at ears, or a head tilt. Diagnosis is based on clinical signs, examination findings, ear examinations, laboratory tests, and sometimes x-rays. In painful pets, sedation or anesthesia and deep ear cleaning may be necessary to examine the ear and remove foreign bodies, hair, or discharge.</p><p><br></p><p>Treatment varies based on severity and duration of the infection. Antibiotics and medication to control secondary yeast infections, anti-inflammatory steroids, and antihistamines are often needed. Any underlying problems (removal of foreign bodies, damaged or scarred tissue, control of concurrent skin problems) must be corrected for successful resolution. Surgery may be needed in extreme, chronic cases.</p><p><br></p><p>These types of infections may require an extended treatment and home care period. Good home care can make the difference between resolution or chronic pain and infection for affected pets.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as directed.</p><p><br></p><p>Follow all home care or post-surgical instructions.</p><p><br></p><p>Don't allow your pet's ears to get wet during bathing or swimming. This can worsen infection.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const ovariohysterectomyDischargeInstructions = `<h2>Ovariohysterectomy Discharge Instructions</h2><p><br></p><p>Today your pet visited the hospital for an ovariohysterectomy procedure (commonly referred to as an elective sterilization (spay).</p><p><br></p><p>WHAT SHOULD I EXPECT AT HOME?</p><p><br></p><p>Your pet was given analgesic medication today that should help keep her comfortable tonight. Your pet may seem reluctant to get up and walk this evening and may sleep more than usual. You may notice a slight cough as a result of the breathing tube in her throat. Most pets are able to drink small amounts of water and eat a small meal. Your pet needs to have someone home with her tonight.</p><p><br></p><p>IS THERE AN INCISION?</p><p><br></p><p>Your pet will have an incision line on her belly. Your doctor may have used visible external sutures or dissolvable, internal sutures that you cannot see, depending on the surgical technique. The incision line needs to stay clean and dry. Do not bathe your pet or allow her to swim until the incision is healed (10-14 days). When your pet is unattended, she should wear an Elizabethan collar (cone) to prevent any self-trauma to the incision site. The incision must remain clean and dry to give the best chance of healing.</p><p><br></p><p>If there are visible sutures in place, these will need to be removed in 10-14 days.</p><p><br></p><p>SPECIAL DIET INSTRUCTIONS:</p><p><br></p><p>Wait at least 2 hours after getting home before feeding. Feed your pet only 1/4 to 1/2 the normal amount of her food and water or offer ice cubes. Pets may feel nauseous after surgery and may vomit if given large amounts of water or food. Tomorrow you may return to normal feeding and water unless otherwise instructed by your pet’s doctor.</p><p><br></p><p>Watch your pet for the following signs and call your local hospital / after-hours emergency clinic if seen:</p><p><br></p><p>• Unresponsive/unable to stand/unable to rouse from sleep</p><p><br></p><p>• Swelling or discoloration of the belly (mild bruising is common)</p><p><br></p><p>• Bleeding from the incision site</p><p><br></p><p>• Straining to urinate or defecate, or inability to produce urine when trying to urinate</p><p><br></p><p>• Pale/white mucous membranes</p><p><br></p><p>• Vomiting/diarrhea/excessive drooling</p><p><br></p><p>• Redness, swelling, pain or extreme warmth around the incision site</p><p><br></p><p>MISCELLANEOUS INFORMATION:</p><p><br></p><p>If your pet was in heat at the time of surgery, there may still be vaginal discharge, and males may still show attraction to her. Keep her indoors and take her outdoors on a leash only for the next 1-2 weeks.</p><p><br></p><p>Restrict her activity (keep indoors, outside for controlled walks and elimination needs on a leash only) for the next 10-14 days until the incision is healed and / or external sutures are removed.</p><p><br></p><p>If you notice any concerning symptoms or have any questions or concerns about the health of your pet, please contact your doctor or your local emergency clinic after hours.</p>`;

const overweightObesity = `<h2>Overweight, Obesity</h2><p><br></p><p>Overweight pets generally have more physical ailments and a shorter life span than those of lean or average weight. Excess weight places strain on vital internal organs like the lungs, heart, and liver. It also makes surgery or anesthesia more hazardous. Even breathing and walking are often difficult for seriously overweight pets.</p><p><br></p><p>Obesity means seriously overweight. It almost always results from a combination of too much food and too little exercise. Breed characteristics, temperament, and hormone imbalances may also influence body weight.</p><p><br></p><p>Heavy patients can lose weight by receiving a balanced, lower calorie diet with adequate vitamins and minerals and an increase in exercise. Portion control is imperative to successful weight loss. Gradual weight loss is safest. Special diets and weight control strategies are available.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please feel free to ask the medical team to individualize a plan for your pet.</p><p><br></p><p>If a special diet has been prescribed for your pet, please do not offer any other food, treats, or table foods. Please follow the feeding instructions as outlined by your doctor.</p><p><br></p><p>Regular weight checks are important. Feel free to stop in and use our pet scale.</p><p><br></p><p>Gradually increase your pet's activity. Ask the medical team for details.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const pyometra = `<h2>Pyometra</h2><p><br></p><p>Pyometra is a serious and potentially life-threatening infection of the uterus. It occurs in some unspayed females, usually during middle age. It is common for pyometra to develop a few weeks after a heat cycle. Hormonal changes during and soon after a heat cycle can make the uterus more vulnerable to infection. The entire uterus may fill with pus. Spayed females do not develop this form of the disease. Very rarely, a spayed female can develop an infection of the small amount of uterine tissue that can sometimes remain after a spay surgery (stump pyometra).</p><p><br></p><p>Signs include loss of appetite, excessive thirst, vomiting, vulvar discharge or swelling of the vulva, and abdominal discomfort. The disease can develop slowly over an extended period before the illness becomes apparent. Diagnosis is based on symptoms, examination findings, blood or other tests, and x-rays. Treatment usually requires extensive therapy and surgical removal of the uterus.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT and PREVENTION ***</p><p><br></p><p>Spayed females do not develop this form of the disease.</p><p><br></p><p>It is important to follow any aftercare or post-surgical instructions.</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const pyrantel = `<h2>Pyrantel</h2><p><br></p><p>Summary:</p><p><br></p><p>This summary contains important information about Pyrantel. You should read this information and review it each time the prescription is filled. This sheet is provided as a summary and does not take the place of instructions from your veterinarian. Talk to your veterinarian if you do not understand any of this information or if you want to know more about Pyrantel.</p><p><br></p><p>Pyrantel is an anthelmintic agent, meaning it is used to treat gastrointestinal parasites (worms). Please note that a negative result on a fecal examination does not completely rule out a parasitic infection, due to variations in parasite life cycles. It is recommended to administer a general deworming medication, like Pyrantel, every 6 months, even if a recent fecal examination was negative.</p><p><br></p><p>YOUR PET SHOULD NOT BE GIVEN PYRANTEL IF HE/SHE HAS A KNOWN SENSITIVITY / ALLERGY TO THIS MEDICATION OR RELATED COMPOUNDS.</p><p><br></p><p>HOW AND WHEN DO I GIVE THE MEDICINE TO MY PET?</p><p><br></p><p>Always follow the doctor’s directions. Give the medicine as directed. Use it only as prescribed. See the medicine label for specific instructions.</p><p><br></p><p>Store medicine at room temperature in a tight container, unless otherwise directed.</p><p><br></p><p>See the Surgery client brochure for detailed instructions on how to administer oral medications.</p><p><br></p><p>WHAT SIDE EFFECTS MAY OCCUR?</p><p><br></p><p>Side effects are unlikely, but vomiting may be seen. Rarely, if a large number of intestinal worms are present at the time of treatment, abdominal pain, diarrhea, and lethargy may be seen.</p><p><br></p><p>WHEN SHOULD I CALL MY VETERINARIAN?</p><p><br></p><p>If your pet does not eat or drink at any time during the administration of this drug, please call your veterinarian. Call before stopping the medicine if any side effects occur or if the symptoms persist. Schedule follow-up visits as directed by your veterinarian. Your pet may require blood work and/or other diagnostic tests to check his or her response to the plan of care.</p><p><br></p><p>WARNINGS:</p><p><br></p><p>As with any product, consult your veterinarian before using this product on debilitated, aged, pregnant or nursing pets. If your pet is on any other medication, consult your veterinarian before using this or any other product. Tell your veterinarian about any medications or supplements you are giving, or plan to give your pet. Tell your veterinarian if your pet is pregnant, nursing, or if you plan to breed your pet.</p><p><br></p><p>PLEASE NOTE:</p><p><br></p><p>Keep this and all medications out of the reach of children and other pets. Contact your physician immediately with any concerns of human exposure/ingestion.</p>`;

const ringworms = `<h2>Ringworms (Dermatophytosis)</h2><p><br></p><p>"Ringworm" is the common name for several types of fungi that can infect the skin of pets and people. These organisms can be found in the soil, on animals, or on humans. Pets may acquire a fungal infection from any of these sources and, in turn, pass the infection along to others. Fungal spores can remain a source of infection in the environment for many months. The skin lesions caused by this infection are often circular with a red outer edge, leading to the name "ringworm." However, a worm is not responsible. Hair loss and skin crusting may accompany infection.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and laboratory tests. Special skin testing is required to confirm a diagnosis of "ringworm." Treatment varies depending on the extent and severity of infection. Topical medications or medicated shampoos are effective in many cases. Oral antifungal medications may also be necessary.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications and skin treatments as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Clean all pet bedding, clothing, and grooming materials.</p><p><br></p><p>Up to six weeks of treatment may be required to resolve some cases of "Ringworm."</p><p><br></p><p>Some types of "Ringworm" are contagious to humans.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const sarcopticMange = `<h2><strong>Sarcoptic Mange<span class="ql-cursor">﻿</span></strong></h2><p><br></p><p>Sarcoptic mange (scabies) is caused by a microscopic insect, a mite, which infects dogs, cats, and other mammals, including people. The insect burrows under the skin causing very intense itching. Pets are often so itchy they may chew, rub, or lick their skin until open wounds develop. Symptoms include intense and constant itching, self-mutilation from chewing and scratching, hair loss, skin redness or swelling, crusting, and secondary bacterial infection in the affected area(s). The infection can occur anywhere on the body, especially elbows, ear tips, face, hocks, and chest.</p><p><br></p><p>Diagnosis is attempted by a combination of symptoms, examination findings, and laboratory testing. An important skin test, a "skin scraping," can sometimes detect the parasite microscopically. However, this type of mange can be very difficult to confirm by laboratory testing. Often, suspected cases are treated even if no mites can be found under the microscope. There are several treatment options including medicated dips and injections. Rare side effects or reactions to treatment are possible and some can be breed specific. Be sure to consult the medical team. Multiple treatments are usually required to control mange.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Complete all prescribed medications.</p><p><br></p><p>Additional skin scrapings may be needed to confirm that the mites are gone.</p><p><br></p><p>It is important to monitor your pet's progress carefully and have him/her rechecked as recommended by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const skinMasses = `<h2><strong>Skin Masses</strong></h2><p><br></p><p>Skin masses can arise for a very large number of reasons including infections, tumors, parasites, injury, cysts (clogged or inflamed glands), warts, and calluses. Masses can range in size from pinpoint to many inches in diameter. It can often be difficult to determine the underlying cause without skin or lab tests.</p><p><br></p><p>True tumors (cancer) can be benign, aggressive and life threatening. Sometimes a "tumor" may really turn out to be a wart, a callus, a cyst, or an inflamed area of skin. All skin masses should be evaluated by a veterinarian, especially those that grow, change, become painful, ulcerated, or infected.</p><p><br></p><p>Diagnosis is based on symptoms, examination findings, and skin or lab tests that may include taking a sample of the mass for microscopic analysis. Not all masses will require treatment. If needed, treatment can vary widely based on the type and size of the mass. If the mass is suspicious, immediate removal and microscopic testing may be recommended. All questionable masses should be addressed as soon as possible. Sometimes, the early removal of a cancerous mass can prevent the spread of cancer to other places in the body.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please use all medications as prescribed.</p><p><br></p><p>Monitor your pet's progress carefully and have him or her rechecked if there are any concerns.</p><p><br></p><p>Have your pet rechecked as recommended by your veterinarian.</p><p><br></p><p>Please call the medical team if you have any questions.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const umbilicalHernia = `<h2><strong>Umbilical Hernia</strong></h2><p><br></p><p>An umbilical hernia occurs when the abdominal muscles fail to grow together and properly close the abdominal opening where the naval cord was attached at birth. The hernia usually appears as a soft swelling at the "umbilicus" or belly button.</p><p><br></p><p>Your veterinarian should evaluate all hernias. Mild hernias will contain a small amount of abdominal fat. If the hernia is large enough to allow a loop of the intestine to become entrapped within it, strangulation of the intestine may occur. This is an emergency situation.</p><p><br></p><p>Diagnosis is based on symptoms and examination findings. Hernias should be repaired when the pet is spayed or neutered unless the defect is large enough to warrant immediate repair. Spaying or neutering of pets with umbilical hernias is recommended due to the potential for hereditary predisposition.</p><p><br></p><p>*** IMPORTANT POINTS IN TREATMENT ***</p><p><br></p><p>Please follow all post-surgical instructions.</p><p><br></p><p>Monitor your pet's progress carefully and have him/her rechecked as directed by your veterinarian.</p><p><br></p><p>Please contact your hospital with any questions.</p>`;

const vaccineReaction = `<h2><strong>Vaccine Reaction</strong></h2><p><br></p><p>Your pet has received one or more vaccinations today to protect him or her from serious infectious or contagious diseases. Your diligence and care in providing these vaccines in a timely manner, in conjunction with your veterinarian’s recommendations, is appreciated by everyone on the veterinary team!</p><p><br></p><p>Although these vaccines are safe and effective and have undergone extensive analysis prior to use in our hospitals, occasionally pets may experience an adverse reaction. Vaccines are biologic products, and each pet will have a unique immune system response to a vaccine. One or more of the following conditions may be seen following administration of a vaccine:</p><p><br></p><p>Mild lethargy</p><p><br></p><p>Muscular soreness which may manifest as reluctance to walk or run</p><p><br></p><p>Pain at the injection site</p><p><br></p><p>Decreased appetite</p><p><br></p><p>Mild fever</p><p><br></p><p>Mild vomiting or diarrhea</p><p><br></p><p>These mild reactions usually do not last beyond 2-3 days. If your pet exhibits any of these symptoms, symptoms persist longer than 24 hours or worsen at any time, call your veterinary medical team to discuss them.</p><p><br></p><p>Pets may experience more serious conditions soon after vaccination including:</p><p><br></p><p>Swelling of the face or ears</p><p><br></p><p>Hives or significant itching</p><p><br></p><p>Difficulty breathing</p><p><br></p><p>Significant lethargy</p><p><br></p><p>Significant vomiting or diarrhea</p><p><br></p><p>Swelling, discoloration, or infection at the injection site</p><p><br></p><p>Rarely, pets may have a type of reaction called ‘anaphylaxis’. This can be a life-threatening reaction and require immediate medical intervention. Symptoms include the serious side effects listed above, along with seizures or collapsing episodes. have specific protocols in place to deal with anaphylaxis. Your veterinary team will discuss all treatments and options with you in the event that a serious reaction or anaphylaxis occurs.</p><p><br></p><p>If your pet exhibits any of these signs, bring him or her back to the hospital immediately. He or she may need immediate medical treatment or may need hospitalization in the event of a severe reaction. Please contact your local emergency veterinary service if a problem occurs after regular business hours.</p><p><br></p><p>Occasionally, pets that have received injections develop a localized reaction indicated by a small, hard lump under the skin where vaccines were administered. Please allow us to recheck your pet if this occurs. These lumps may take 1-3 weeks to appear and 2-6 weeks to resolve. If a lump does not resolve, please contact your veterinary team.</p><p><br></p><p>Very seldom, pets that have received a rabies vaccination may develop a small bald spot over the vaccination site. Please contact the medical team if this occurs. These spots are considered to be cosmetic and may be permanent in rare cases.</p><p><br></p><p>Pets receiving the nasal form of Bordetella (Kennel Cough) vaccination may experience a mild upper respiratory reaction. These pets may have a very mild sneeze or runny nose for 2-3 days. Please contact the medical team if this occurs.</p><p><br></p><p>If your pet has had a vaccine reaction in the past, please talk with your veterinary team prior to your pet receiving vaccinations in the future.</p><p><br></p><p>Vaccinations are considered a key component of preventive medicine and are continually being evaluated and improved. However uncommonly they occur, short term and long-term reactions are still possible. Please contact your veterinary medical team if you have any questions or concerns.</p><p><br></p><p>Reference and suggested reading:</p><p><br></p>`;

const contentLibraryData = [
  {
    category: "Anaesthesia_And_Surgery",
    items: [
      {
        title: "Anesthesia & Surgery",
        topic: "Anaesthesia Patient Monitoring",
        status: "Active",
        click: true,
        content: anesthesiaPatientMonitoringData,
        animalClassId: "6788a78433894cabdb5f998b",
      },
      {
        title: "Canine Castration:",
        topic: "Canine Castration",
        status: "Active",
        click: true,
        content: canineCastration,
        animalClassId: "6788a78433894cabdb5f998b",
      },
      {
        title: "Canine Spay - Ovariohysterectomy:",
        topic: "Canine Spay",
        status: "Active",
        click: true,
        content: canineSpay,
        animalClassId: "6788a78433894cabdb5f998b",
      },
      {
        topic: "Dental Prophy",
        status: "Active",
        title: "Dental Prophylaxis:",
        click: true,
        content: dentalProphylaxis,
        animalClassId: "",
      },
      {
        topic: "Feline Castration",
        status: "Active",
        title: "Feline Castration:",
        click: true,
        content: felineCastration,
        animalClassId: "6788a56033894cabdb5f998a",
      },
    ],
  },
  {
    category: "Client_And_Communications",
    items: [
      {
        topic: "Anaesthesia Risk/Benefit",
        title: "Anesthesia Risk/Benefit:",
        status: "Active",
        click: true,
        content: anesthesiaRiskAndBenifit,
        animalClassId: "",
      },
      {
        title: "Client Connections Call ",
        topic: "Client Connections Call",
        status: "Active",
        click: true,
        content: clientConnectionCalls,
        animalClassId: "",
      },
      {
        title: "Follow up call",
        topic: "Follow-up Call",
        status: "Active",
        click: true,
        content: followUpCall,
        animalClassId: "",
      },
      {
        title: "No Exam Performed",
        topic: "No Exam Performed",
        status: "Active",
        click: true,
        content: noExamPerformed,
        animalClassId: "",
      },
      {
        title: "Referral for Immediate Critical Care",
        topic: "Referral for Immediate Critical Care",
        status: "Active",
        click: true,
        content: referralImmediateCare,
        animalClassId: "",
      },
      {
        title: "Referral to Specialist",
        topic: "Referral to Specialist",
        status: "Active",
        click: true,
        content: referralToSpecialist,
        animalClassId: "",
      },
      {
        title: "Vaccine Benefit/Risk:",
        topic: "Vaccine Risk/Benefit",
        status: "Active",
        click: true,
        content: vaccineRiskAndbenefit,
        animalClassId: "",
      },
    ],
  },
  {
    category: "Client_Instructions_Medical",
    items: [
      {
        title: "Abscess",
        topic: "Abscess",
        status: "Active",
        click: true,
        content: abscess,
        animalClassId: "",
      },
      {
        title: "Allergic Reaction",
        topic: "Allergic Reaction",
        status: "Active",
        click: true,
        content: allergicReaction,
        animalClassId: "",
      },
      {
        title: "Anal Sac (Gland) Disease",
        topic: "Anal Sac (Gland) Disease",
        status: "Active",
        click: true,
        content: analSacDisease,
        animalClassId: "",
      },
      {
        title: "Atopy / Food Related Allergic Skin Disease",
        topic: "Atopy / Food Related Allergic Skin Disease",
        status: "Active",
        click: true,
        content: atopy,
        animalClassId: "",
      },
      {
        title: "Canine Influenza Vaccine",
        topic: "Canine Influenza Vaccine",
        status: "Active",
        click: true,
        content: canineinfluenzaVaccine,
        animalClassId: "",
      },
      {
        title: "Canine Parvo Virus",
        topic: "Canine Parvo Virus",
        status: "Active",
        click: true,
        content: canineParvoVirus,
        animalClassId: "",
      },
      {
        title: "Cataracts",
        topic: "Cataracts",
        status: "Active",
        click: true,
        content: cataracts,
        animalClassId: "",
      },
      {
        title: "Corneal Ulcer, Abrasion, and Laceration",
        topic: "Corneal Ulcer, Abrasion, and Laceration",
        status: "Active",
        click: true,
        content: cornealUlcer,
        animalClassId: "",
      },
      {
        title: "Demodectic Mange",
        topic: "Demodectic Mange",
        status: "Active",
        click: true,
        content: demodecticMange,
        animalClassId: "",
      },
      {
        title: "Dental Prophylaxis Discharge Instructions",
        topic: "Dental Prophylaxis Discharge Instructions",
        status: "Active",
        click: true,
        content: dentalProphy,
        animalClassId: "",
      },
      {
        title: "Dental Tartar, Gingivitis, Periodontal Disease",
        topic: "Dental Tartar, Gingivitis, Periodontal Disease",
        status: "Active",
        click: true,
        content: dentalTartar,
        animalClassId: "",
      },
      {
        title: "Diabetes Mellitus",
        topic: "Diabetes Mellitus",
        status: "Active",
        click: true,
        content: diabetesMellitus,
        animalClassId: "",
      },
      {
        title: "Ear Cleaning & Medicating",
        topic: "Ear Cleaning & Medicating",
        status: "Active",
        click: true,
        content: earCleaning,
        animalClassId: "",
      },
      {
        title: "Ear Mites",
        topic: "Ear Mites",
        status: "Active",
        click: true,
        content: earMites,
        animalClassId: "",
      },
      {
        title: "Ectropion, Entropion",
        topic: "Ectropion, Entropion",
        status: "Active",
        click: true,
        content: ectropion,
        animalClassId: "",
      },
      {
        title: "Epilepsy & Seizures",
        topic: "Epilepsy & Seizures",
        status: "Active",
        click: true,
        content: epilepsy,
        animalClassId: "",
      },
      {
        title: "Euthanasia",
        topic: "Euthanasia",
        status: "Active",
        click: true,
        content: euthanasia,
        animalClassId: "",
      },
      {
        title: "Feline Immunodeficiency Virus (FIV)",
        topic: "Feline Immunodeficiency Virus (FIV)",
        status: "Active",
        click: true,
        content: felineImmunodeficiencyVirus,
        animalClassId: "",
      },
      {
        title: "Feline Upper Respiratory Virus",
        topic: "Feline Upper Respiratory Virus",
        status: "Active",
        click: true,
        content: felineUpperRespiratoryVirus,
        animalClassId: "",
      },
      {
        title: "Fleas & Flea Allergy Dermatitis",
        topic: "Fleas & Flea Allergy Dermatitis",
        status: "Active",
        click: true,
        content: fleasAndFlea,
        animalClassId: "",
      },
      {
        title: "Giardia",
        topic: "Giardia",
        status: "Active",
        click: true,
        content: giardia,
        animalClassId: "",
      },
      {
        title: "Heartworm Disease & Prevention",
        topic: "Heartworm Disease & Prevention",
        status: "Active",
        click: true,
        content: heatwormDisease,
        animalClassId: "",
      },
      {
        title: "Heartworm Testing (4DX)",
        topic: "Heartworm Testing (4DX)",
        status: "Active",
        click: true,
        content: heartwormTesting,
        animalClassId: "",
      },
      {
        title: "Hip Dysplasia",
        topic: "Hip Dysplasia",
        status: "Active",
        click: true,
        content: hipDysplasia,
        animalClassId: "",
      },
      {
        title: "Hyperthyroidism",
        topic: "Hyperthyroidism",
        status: "Active",
        click: true,
        content: hyperthyroidism,
        animalClassId: "",
      },
      {
        title: "Hypothyroidism",
        topic: "Hypothyroidism",
        status: "Active",
        click: true,
        content: hypothyroidism,
        animalClassId: "",
      },
      {
        title: "Insulin",
        topic: "Insulin",
        status: "Active",
        click: true,
        content: insulin,
        animalClassId: "",
      },
      {
        title: "Kennel Cough, Bordetella",
        topic: "Kennel Cough, Bordetella",
        status: "Active",
        click: true,
        content: kennelCough,
        animalClassId: "",
      },
      {
        title: "Lick Granuloma (Acral Lick Dermatitis)",
        topic: "Lick Granuloma (Acral Lick Dermatitis)",
        status: "Active",
        click: true,
        content: lickGranuloma,
        animalClassId: "",
      },
      {
        title: "Meloxicam",
        topic: "Meloxicam",
        status: "Active",
        click: true,
        content: meloxicam,
        animalClassId: "",
      },
      {
        title: "NoSorb",
        topic: "NoSorb",
        status: "Active",
        click: true,
        content: noSorb,
        animalClassId: "",
      },
      {
        title: "NSAIDS",
        topic: "NSAIDS",
        status: "Active",
        click: true,
        content: nsaids,
        animalClassId: "",
      },
      {
        title: "Otitis Externa",
        topic: "Otitis Externa",
        status: "Active",
        click: true,
        content: otitisExterna,
        animalClassId: "",
      },
      {
        title: "Otitis Interna, Otitis Media",
        topic: "Otitis Interna, Otitis Media",
        status: "Active",
        click: true,
        content: otitisInterna,
        animalClassId: "",
      },
      {
        title: "Ovariohysterectomy Discharge Instructions",
        topic: "Ovariohysterectomy Discharge Instructions",
        status: "Active",
        click: true,
        content: ovariohysterectomyDischargeInstructions,
        animalClassId: "",
      },
      {
        title: "Overweight, Obesity",
        topic: "Overweight, Obesity",
        status: "Active",
        click: true,
        content: overweightObesity,
        animalClassId: "",
      },
      {
        title: "Pyometra",
        topic: "Pyometra",
        status: "Active",
        click: true,
        content: pyometra,
        animalClassId: "",
      },
      {
        title: "Pyrantel",
        topic: "Pyrantel",
        status: "Active",
        click: true,
        content: pyrantel,
        animalClassId: "",
      },
      {
        title: "Ringworms (Dermatophytosis)",
        topic: "Ringworms (Dermatophytosis)",
        status: "Active",
        click: true,
        content: ringworms,
        animalClassId: "",
      },
      {
        title: 'Sarcoptic Mange',
        topic: "Sarcoptic Mange",
        status: "Active",
        click: true,
        content: sarcopticMange,
        animalClassId: "",
      },
      {
        title: 'Skin Masses',
        topic: "Skin Masses",
        status: "Active",
        click: true,
        content: skinMasses,
        animalClassId: "",
      },
      {
        title: "Umbilical Hernia",
        topic: "Umbilical Hernia",
        status: "Active",
        click: true,
        content: umbilicalHernia,
        animalClassId: "",
      },
      {
        title: "Umbilical Hernia",
        topic: "Vaccine Reaction",
        status: "Active",
        click: true,
        content: vaccineReaction,
        animalClassId: "",
      },
    ],
  },
  {
    category: "In_House_Dx",
    items: [],
  },
];
export default contentLibraryData;
