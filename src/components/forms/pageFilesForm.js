'use client';
import Image from "next/image";
import SectionBox from "../layout/sectionBox";
import SubmitButton from "../buttons/submitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faComment, faGripLines, faFile, faFilePdf, faImage, faPlus, faSave, faTrash, faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { upload } from "@/libs/upload";
import { toast } from "react-hot-toast";
import { savePageFiles } from "@/actions/fileActions";
import { useRouter } from 'next/navigation';

export default function PageFilesForm({page, user}) {
  const router = useRouter();
  const [files, setFiles] = useState(page.files || []);

  async function save() {
    try {
      const result = await savePageFiles(files);

      if (result.success) {
        toast.success('Зачувано!');
        router.refresh();
      } else {
        toast.error('Грешка при зачувување!');
      }
    } catch (error) {
      toast.error('Грешка при зачувување!');
    }
  }

  function addNewFile() {
    setFiles(prev => {
      return [...prev, {
        key: Date.now().toString(),
        title: '', 
        description: '', 
        url: '',
        name: '',
        type: '',
        size: 0
      }];
    });
  }

  function handleFileUpload(ev, fileKeyForUpload) {
    const file = ev.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Дозволени се само слики (JPEG, PNG, GIF, WebP) и PDF датотеки!');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Датотеката е премногу голема! Максимална големина: 10MB');
      return;
    }

    upload(ev, uploadedFileUrl => {
      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles.forEach((fileItem, index) => {
          if (fileItem.key === fileKeyForUpload) {
            fileItem.url = uploadedFileUrl;
            fileItem.name = file.name;
            fileItem.type = file.type;
            fileItem.size = file.size;
            // Auto-fill title if empty
            if (!fileItem.title) {
              fileItem.title = file.name.split('.')[0];
            }
          }
        });
        return newFiles;
      });
      toast.success('Датотеката е прикачена!');
    });
  }

  function handleFileChange(keyOfFileToChange, prop, ev) {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.forEach((fileItem) => {
        if (fileItem.key === keyOfFileToChange) {
          fileItem[prop] = ev.target.value;
        }
      });
      return newFiles;
    });
  }

  function removeFile(fileKeyToRemove) {
    setFiles(prevFiles =>
      [...prevFiles].filter(f => f.key !== fileKeyToRemove)
    );
    toast.success('Датотеката е избришана!');
  }

  function getFileIcon(type) {
    if (type?.startsWith('image/')) {
      return faImage;
    } else if (type === 'application/pdf') {
      return faFilePdf;
    }
    return faFile;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function isImage(type) {
    return type?.startsWith('image/');
  }

  return (
    <SectionBox>
      <form action={save}>
        <h2 className="text-2xl font-bold mb-4">Датотеки</h2>
        <button 
          onClick={addNewFile} 
          type="button" 
          className="text-[#3b82f6] text-lg flex gap-2 items-center cursor-pointer hover:text-[#1d4ed8]"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Внеси нова датотека</span>
        </button>
        <div>
          <ReactSortable handle=".handle" list={files} setList={setFiles}>
            {files.map(f => (
              <div key={f.key} className="mt-8 flex gap-4 items-center sm:flex-nowrap flex-wrap justify-center">
                <div className="mt-8 flex gap-2 items-center">
                  <div className="handle py-2 cursor-grab">
                    <FontAwesomeIcon icon={faGripLines} className="text-[#6b7280] hover:text-[#60a5fa]" />
                  </div>
                  <div className="text-center flex flex-col items-center gap-2 text-sm min-w-[120px]">
                    <div className="aspect-square max-w-[50px]">
                      {f.url && isImage(f.type) ? (
                        <Image 
                          src={f.url} 
                          alt={f.title || 'uploaded file'} 
                          className="w-full h-full object-cover rounded-lg"
                          width={80} 
                          height={80} 
                        />
                      ) : f.url ? (
                        <FontAwesomeIcon 
                          icon={getFileIcon(f.type)} 
                          className="text-[#6b7280] text-2xl" 
                        />
                      ) : (
                        <FontAwesomeIcon icon={faFile} className="text-[#d1d5db] text-2xl" />
                      )}
                    </div>
                    {f.size > 0 && (
                      <div className="text-xs text-[#6b7280]">
                        {formatFileSize(f.size)}
                      </div>
                    )}
                    <div>
                      <input 
                        onChange={ev => handleFileUpload(ev, f.key)} 
                        id={'file' + f.key} 
                        type="file" 
                        accept="image/*,.pdf"
                        className="hidden" 
                      />
                      <label 
                        htmlFor={'file' + f.key}
                        className="py-2 px-6 flex items-center gap-1 border border-[#e5e7eb] hover:text-[#2563eb] cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        <span>{f.url ? 'Промени датотека' : 'Прикачи датотека'}</span>
                      </label>
                    </div>
                    {f.url && (
                      <div className="flex gap-1">
                        <a 
                          href={f.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 px-2 text-xs flex items-center gap-1 text-[#059669] hover:text-[#047857] cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Преглед</span>
                        </a>
                        <a 
                          href={f.url} 
                          download={f.name}
                          className="p-1 px-2 text-xs flex items-center gap-1 text-[#7c3aed] hover:text-[#5b21b6] cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          <span>Преземи</span>
                        </a>
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeFile(f.key)}
                      className="p-2 px-4 flex items-center gap-1 text-[#ef4444] cursor-pointer hover:text-[#b91c1c]"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Избриши ја датотеката</span>
                    </button>
                  </div>
                </div>
                <div className="grow">
                  <label className="input-label">Наслов</label>
                  <input 
                    value={f.title} 
                    onChange={ev => handleFileChange(f.key, 'title', ev)} 
                    type="text" 
                    placeholder="Наслов на датотеката" 
                  />
                  <label className="input-label">Опис</label>
                  <textarea 
                    value={f.description} 
                    onChange={ev => handleFileChange(f.key, 'description', ev)} 
                    placeholder="Опис на датотеката (не е задолжително)"
                    rows="3"
                  />
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        {files.length === 0 && (
          <div className="text-center py-8 text-[#6b7280]">
            <FontAwesomeIcon icon={faComment} size="2x" className="mb-2" />
            <p>Немате прикачено датотеки. Кликнете на &quot;Внеси нова датотека&quot; за да започнете.</p>
          </div>
        )}
        <div className="max-w-[200px] mx-auto mt-4">
          <SubmitButton>
            <FontAwesomeIcon icon={faSave} />
            <span>Зачувај</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}