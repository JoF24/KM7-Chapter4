const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const students = require("../data/student.json");

const prisma = new PrismaClient();

exports.getStudents = async (name, nick_name) => {
    // Define query here
    let query = {
        include: {
            classes: true,
            universities: true,
        },
    };

    // It will generate the query
    let orQuery = [];
    if (name) {
        orQuery.push({
            name: { contains: name, mode: "insensitive" },
        });
    }
    if (nick_name) {
        orQuery.push({
            nick_name: { contains: nick_name, mode: "insensitive" },
        });
    }
    if (orQuery.length > 0) {
        query.where = {
            ...query.where,
            OR: orQuery,
        };
    }

    // Find by query
    const searchedStudents = await prisma.students.findMany(query);

    // Convert BigInt fields to string for safe serialization
    const serializedStudents = JSONBigInt.stringify(searchedStudents);
    return JSONBigInt.parse(serializedStudents);
};

exports.getStudentById = async (id) => {
    // find student by id
    const student = await prisma.students.findFirst({
        where: {
            id: id,
        },
    });

    // Convert BigInt fields to string for safe serialization
    const serializedStudents = JSONBigInt.stringify(student);
    return JSONBigInt.parse(serializedStudents);
};

exports.createStudent = async (data) => {
    const largestIdStudent = await prisma.students.findFirst({
        orderBy: {
            id: 'desc',  // Mengurutkan ID dari yang terbesar
        },
        select: {
            id: true,  // Hanya ambil field ID
        },
    });
     // Jika tidak ada siswa di database, set ID baru ke 1, jika ada, tambahkan 1
     const newId = largestIdStudent ? BigInt(largestIdStudent.id) + BigInt(1) : BigInt(1);

     // Membuat data baru dengan ID yang di-generate
     const data_baru = {
         ...data, // Menggunakan spread operator untuk menyertakan data input
         id: newId.toString(),  // Mengubah ID baru menjadi string untuk penyimpanan
     };
 
     // Buat siswa baru dengan data yang sudah diupdate
     const newStudent = await prisma.students.create({
         data: data_baru,
     });
     
    // Convert BigInt fields to string for safe serialization (jika ada BigInt)
    const serializedStudents = JSONBigInt.stringify(newStudent);
    return JSONBigInt.parse(serializedStudents);
};

exports.updateStudent = async(id, data) => {
    // Ambil data lama dari database berdasarkan ID
    const existingStudent = await prisma.students.findUnique({
        where: { id: id },
    });

    if (!existingStudent) {
        throw new NotFoundError("Student is Not Found in the database!");
    }

    const updatedData = {
        name: data.name || existingStudent.name, 
        nick_name: data.nick_name || existingStudent.nick_name,
        class_id: data.class_id || existingStudent.class_id,
        university_id: data.university_id_id || existingStudent.university_id,
    };

    // Lakukan update dengan data gabungan
    const updatedStudent = await prisma.students.update({
        where: { id: id },
        data: updatedData,
    });

    // Convert BigInt fields to string for safe serialization
    const serializedStudents = JSONBigInt.stringify(updatedStudent);
    return JSONBigInt.parse(serializedStudents);
};

exports.deleteStudentById = async(id) => {
    // Cek apakah siswa dengan ID tersebut ada di database
    const existingStudent = await prisma.students.findUnique({
        where: { id: id },
    });

    if (!existingStudent) {
        throw new NotFoundError("Student is Not Found in the database!");
    }

    // Jika ditemukan, lakukan penghapusan dan simpan data yang dihapus
    const deletedStudent = await prisma.students.delete({
        where: { id: id },
    });

    // Convert BigInt fields to string for safe serialization (jika ada BigInt)
    const serializedStudent = JSONBigInt.stringify(deletedStudent);
    return JSONBigInt.parse(serializedStudent);
};