import { CiEdit } from "react-icons/ci";
import { useState } from 'react';
import AdminProfile from '../pages/dashboard/components/AdminProfile';
import Swal from "sweetalert2";

const initialTerms = `
1. Acceptance of Terms
By using the Timberlens app, you agree to be bound by these Terms and Conditions...

2. App Purpose
TimberLens is designed to help users identify timber and tree species...

3. User Responsibilities
Users must upload clear, non-offensive images for analysis...

4. Data Usage
We may store scanned history and basic user data...

5. Intellectual Property
All content, branding, and design within TimberLens...

6. Limitations
We do not guarantee the complete accuracy of timber identification...

7. Updates
These terms may change over time...

8. Contact Us
support@timberlensapp.com
`;

export default function TermsEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [terms, setTerms] = useState(initialTerms);
  const [editedTerms, setEditedTerms] = useState(initialTerms);

  const handleToggleEdit = () => {
    if (isEditing) {
      // Confirm cancel
      Swal.fire({
        title: 'Discard Changes?',
        text: "Your unsaved changes will be lost!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          setIsEditing(false);
          setEditedTerms(terms); // reset edits
        }
      });
    } else {
      // Enter edit mode
      setEditedTerms(terms); // copy original to edited
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Save Changes?',
      text: "Do you want to save the updated Terms & Conditions?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        setTerms(editedTerms); // apply changes
        setIsEditing(false);

        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Terms and conditions updated successfully.',
          confirmButtonColor: '#22c55e',
        });
      }
    });
  };

  return (
    <div className="w-full min-h-screen ">
      <div className='mb-8'>
        <AdminProfile />
      </div>

      <div className="relative w-full">
        <button 
          onClick={handleToggleEdit}
          className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {isEditing ? 'Cancel' : (
            <>
              <CiEdit className="text-xl" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <textarea
          className="w-full min-h-[calc(100vh-180px)] p-4 text-lg font-medium border rounded-lg"
          value={editedTerms}
          onChange={(e) => setEditedTerms(e.target.value)}
        />
      ) : (
        <div className="w-full min-h-[calc(100vh-180px)] p-4 text-lg font-medium space-y-6 font-poppins">
          {terms.trim().split('\n\n').map((section) => {
            const [numberAndTitle, ...content] = section.split('\n');
            const [number, ...titleParts] = numberAndTitle.split('. ');
            const title = titleParts.join('. ');
            
            return (
              <div key={number}>
                <p className="font-bold text-xl mb-2">
                  {number}. {title}
                </p>
                {content.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}